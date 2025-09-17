import React, { useState, useEffect } from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';
import './Pricing.css';

// Initialize Stripe - will be set when env variable is configured
const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');

  useEffect(() => {
    // Check if user has an active subscription
    if (user) {
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (data && !error) {
        setCurrentPlan('pro');
      }
    } catch (err) {
      // No active subscription, user is on free plan
      console.log('User is on free plan');
    }
  };

  const handleSelectPlan = async (planType) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (planType === 'free') {
      // Already on free plan
      return;
    }

    if (planType === 'pro' && currentPlan === 'free') {
      setLoading(true);

      try {
        // Create checkout session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            priceId: billingPeriod === 'monthly'
              ? import.meta.env.VITE_STRIPE_PRICE_MONTHLY
              : import.meta.env.VITE_STRIPE_PRICE_YEARLY,
          }),
        });

        const { sessionId } = await response.json();

        // Redirect to Stripe Checkout
        if (stripePromise) {
          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({ sessionId });

          if (error) {
            console.error('Stripe redirect error:', error);
            alert('Something went wrong. Please try again.');
          }
        } else {
          alert('Payment system is not configured yet. Please contact support.');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to start checkout. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const monthlyPrice = 4.99;
  const yearlyPrice = 49;
  const yearlySaving = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

  return (
    <main className="main-container">
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="pricing-header">
            <h2 className="pricing-title">Simple, Transparent Pricing</h2>
            <p className="pricing-description">
              Start free, upgrade when you need unlimited power
            </p>

            <div className="billing-toggle">
              <button
                className={`toggle-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                className={`toggle-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingPeriod('yearly')}
              >
                Yearly
                <span className="save-badge">{yearlySaving}% OFF</span>
              </button>
            </div>
          </div>

          <div className="pricing-cards-container">
            <div className="pricing-cards">
              {/* Free Plan */}
              <div className={`pricing-card ${currentPlan === 'free' ? 'current-plan' : ''}`}>
                <div className="card-content">
                  <div className="card-header">
                    <h3 className="plan-title">Free</h3>
                    <div className="plan-price">
                      $0
                      <span className="price-period">forever</span>
                    </div>
                    <p className="plan-description">Perfect for trying out Convrilo</p>
                  </div>

                  <button
                    className={`plan-button ${currentPlan === 'free' ? 'current' : 'outline'}`}
                    onClick={() => handleSelectPlan('free')}
                    disabled={currentPlan === 'free'}
                  >
                    {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
                  </button>

                  <ul className="features-list">
                    <li className="feature-item">
                      <Check className="check-icon" />
                      10 conversations per day
                    </li>
                    <li className="feature-item">
                      <Check className="check-icon" />
                      File uploads up to 100MB
                    </li>
                    <li className="feature-item">
                      <Check className="check-icon" />
                      Basic AI models
                    </li>
                    <li className="feature-item">
                      <Check className="check-icon" />
                      Community support
                    </li>
                    <li className="feature-item disabled">
                      <X className="x-icon" />
                      Priority processing
                    </li>
                    <li className="feature-item disabled">
                      <X className="x-icon" />
                      Advanced AI models (GPT-4, Claude)
                    </li>
                    <li className="feature-item disabled">
                      <X className="x-icon" />
                      API access
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pro Plan */}
              <div className={`pricing-card highlighted ${currentPlan === 'pro' ? 'current-plan' : ''}`}>
                <div className="popular-badge">
                  <Sparkles size={16} />
                  Most Popular
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <h3 className="plan-title">Pro</h3>
                    <div className="plan-price">
                      ${billingPeriod === 'monthly' ? monthlyPrice : yearlyPrice}
                      <span className="price-period">
                        / {billingPeriod === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    <p className="plan-description">
                      For professionals and power users
                    </p>
                    {billingPeriod === 'yearly' && (
                      <div className="yearly-savings">
                        Save ${(monthlyPrice * 12 - yearlyPrice).toFixed(0)} per year!
                      </div>
                    )}
                  </div>

                  <button
                    className={`plan-button primary ${loading ? 'loading' : ''}`}
                    onClick={() => handleSelectPlan('pro')}
                    disabled={loading || currentPlan === 'pro'}
                  >
                    {loading ? 'Processing...' :
                     currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                  </button>

                  <div className="pro-features-header">
                    <div className="features-title">Everything in Free, plus:</div>
                  </div>

                  <ul className="features-list">
                    <li className="feature-item pro">
                      <Check className="check-icon pro" />
                      <strong>Unlimited</strong> conversations
                    </li>
                    <li className="feature-item pro">
                      <Check className="check-icon pro" />
                      File uploads up to <strong>500MB</strong>
                    </li>
                    <li className="feature-item pro">
                      <Check className="check-icon pro" />
                      Access to <strong>GPT-4</strong> & <strong>Claude 3</strong>
                    </li>
                    <li className="feature-item pro">
                      <Check className="check-icon pro" />
                      Priority processing & support
                    </li>
                    <li className="feature-item pro">
                      <Check className="check-icon pro" />
                      Advanced conversation features
                    </li>
                    <li className="feature-item pro">
                      <Check className="check-icon pro" />
                      API access for integrations
                    </li>
                    <li className="feature-item pro">
                      <Check className="check-icon pro" />
                      Export conversations in any format
                    </li>
                    <li className="feature-item pro">
                      <Check className="check-icon pro" />
                      Early access to new features
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="pricing-footer">
            <p>🔒 Secure payment via Stripe • Cancel anytime • No hidden fees</p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">Can I cancel anytime?</h3>
              <p className="faq-answer">
                Yes! You can cancel your Pro subscription anytime from your profile page.
                You'll keep Pro features until the end of your billing period.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What payment methods do you accept?</h3>
              <p className="faq-answer">
                We accept all major credit cards, debit cards, and digital wallets through
                Stripe's secure payment processing.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Is there a student discount?</h3>
              <p className="faq-answer">
                Yes! Students get 50% off Pro plans. Contact support with your .edu email
                to get your discount code.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What happens to my data if I downgrade?</h3>
              <p className="faq-answer">
                Your data is always yours. If you downgrade, you'll keep all your existing
                conversations but will be limited by Free plan limits for new ones.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Pricing;
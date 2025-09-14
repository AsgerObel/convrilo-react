import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import './Pricing.css';

function PricingCard({ title, price, description, features, highlight = false, buttonVariant = "outline" }) {
  return (
    <div className={`pricing-card ${highlight ? 'highlighted' : ''}`}>
      <div className="card-content">
        <div className="card-header">
          <h3 className="plan-title">{title}</h3>
          <div className="plan-price">{price} <span className="price-period">/ mo</span></div>
          <p className="plan-description">{description}</p>
        </div>

        <button className={`plan-button ${buttonVariant}`}>Get Started</button>
      </div>

      {highlight && (
        <div className="pro-features-header">
          <div className="features-title">Everything in Free, plus:</div>
        </div>
      )}

      <ul className="features-list">
        {features.map((item, index) => (
          <li key={index} className="feature-item">
            <Check className="check-icon" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pricing() {
  useEffect(() => {
    // Add scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elementsToAnimate = document.querySelectorAll('.pricing-card, .faq-item');
    elementsToAnimate.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="main-container">
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="pricing-header">
            <h2 className="pricing-title">Plans made for every workflow</h2>
            <p className="pricing-description">
              Start converting files with our free plan. Upgrade anytime as your needs grow.
            </p>
          </div>

          <div className="pricing-cards-container">
            <div className="pricing-cards">
              <PricingCard
                title="Free"
                price="$0"
                description="Perfect to test our file conversion tools"
                buttonVariant="outline"
                features={[
                  "Convert up to 10 files per day",
                  "Support for 20+ file formats",
                  "Basic image conversion",
                  "File size up to 25MB",
                  "Email support"
                ]}
              />

              <PricingCard
                title="Pro"
                price="$19"
                description="For professionals with heavy conversion needs"
                buttonVariant="primary"
                highlight
                features={[
                  "Unlimited file conversions",
                  "Support for 40+ file formats",
                  "Advanced image, video & audio tools",
                  "File size up to 1GB",
                  "Batch processing up to 100 files",
                  "API access for integrations",
                  "Priority email support",
                  "Custom conversion settings",
                  "Cloud storage integrations",
                  "24/7 priority support"
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">Can I change plans anytime?</h3>
              <p className="faq-answer">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Is there a free trial?</h3>
              <p className="faq-answer">
                Our Free plan gives you full access to basic features with no time limit. Upgrade when you're ready for more.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What file formats do you support?</h3>
              <p className="faq-answer">
                We support 40+ formats including images, documents, videos, audio files, and more. Check our documentation for the full list.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How secure is my data?</h3>
              <p className="faq-answer">
                All files are encrypted in transit and at rest. We automatically delete files after conversion and never store your content long-term.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Pricing;
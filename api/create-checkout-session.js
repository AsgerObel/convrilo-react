// Vercel serverless function for Stripe checkout sessions
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email, priceId } = req.body;

  console.log('Checkout request:', { userId, email, priceId });

  if (!userId || !email || !priceId) {
    console.log('Missing fields:', { userId: !!userId, email: !!email, priceId: !!priceId });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.log('Missing STRIPE_SECRET_KEY');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Create or retrieve Stripe customer
    let customer;
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customer = customers.data[0];
      console.log('Found existing customer:', customer.id);
    } else {
      customer = await stripe.customers.create({
        email: email,
        metadata: {
          supabase_user_id: userId,
        },
      });
      console.log('Created new customer:', customer.id);
    }

    // Get the site URL from headers or use default
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers['host'];
    const baseUrl = `${protocol}://${host}`;

    console.log('Creating checkout session for customer:', customer.id, 'price:', priceId);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/profile?success=true`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        supabase_user_id: userId,
      },
    });

    console.log('Created checkout session:', session.id);
    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      details: error.message
    });
  }
};
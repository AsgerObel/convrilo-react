// Vercel serverless function for Stripe checkout sessions

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for Stripe secret key
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return res.status(500).json({
      error: 'Payment system is not configured. Please contact support.',
      details: 'Missing Stripe configuration'
    });
  }

  try {
    // Initialize Stripe
    const Stripe = require('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    // Parse request body
    const { userId, email, priceId } = req.body;

    console.log('Checkout request received:', { userId, email, priceId });

    // Validate input
    if (!userId || !email || !priceId) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          userId: !!userId,
          email: !!email,
          priceId: !!priceId
        }
      });
    }

    // Create or retrieve Stripe customer
    let customer;

    try {
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
    } catch (customerError) {
      console.error('Customer creation/retrieval error:', customerError);
      return res.status(500).json({
        error: 'Failed to process customer',
        details: customerError.message
      });
    }

    // Get the site URL from request headers
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'convrilo-react.vercel.app';
    const baseUrl = `${protocol}://${host}`;

    console.log('Using base URL:', baseUrl);

    // Create checkout session
    try {
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

      return res.status(200).json({
        sessionId: session.id,
        url: session.url
      });
    } catch (sessionError) {
      console.error('Session creation error:', sessionError);
      return res.status(500).json({
        error: 'Failed to create checkout session',
        details: sessionError.message
      });
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message
    });
  }
};
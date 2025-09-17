// Simple test endpoint to verify Vercel functions are working
module.exports = (req, res) => {
  try {
    res.status(200).json({
      message: 'API is working!',
      method: req.method,
      env: {
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        stripeKeyLength: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0,
        hasMonthlyPrice: !!process.env.VITE_STRIPE_PRICE_MONTHLY,
        hasYearlyPrice: !!process.env.VITE_STRIPE_PRICE_YEARLY,
        nodeVersion: process.version,
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Test endpoint error',
      message: error.message,
      stack: error.stack
    });
  }
};
// Simple test endpoint to verify Vercel functions are working
module.exports = (req, res) => {
  res.status(200).json({
    message: 'API is working!',
    method: req.method,
    env: {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
    }
  });
};
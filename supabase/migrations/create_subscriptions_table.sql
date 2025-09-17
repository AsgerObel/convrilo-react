-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create usage_limits table for tracking user limits
CREATE TABLE IF NOT EXISTS public.usage_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  conversations_today INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  total_conversations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Usage limits policies
CREATE POLICY "Users can view own usage limits" ON public.usage_limits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage limits" ON public.usage_limits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage usage limits" ON public.usage_limits
  FOR ALL USING (auth.role() = 'service_role');

-- Function to check if user is pro
CREATE OR REPLACE FUNCTION public.is_pro_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE subscriptions.user_id = $1
    AND status = 'active'
    AND current_period_end > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's daily conversation count
CREATE OR REPLACE FUNCTION public.get_daily_conversations(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
  last_reset DATE;
BEGIN
  SELECT conversations_today, last_reset_date
  INTO count, last_reset
  FROM public.usage_limits
  WHERE usage_limits.user_id = $1;

  -- Reset count if it's a new day
  IF last_reset < CURRENT_DATE OR last_reset IS NULL THEN
    UPDATE public.usage_limits
    SET conversations_today = 0,
        last_reset_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE usage_limits.user_id = $1;
    RETURN 0;
  END IF;

  RETURN COALESCE(count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment conversation count
CREATE OR REPLACE FUNCTION public.increment_conversation_count(user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.usage_limits (user_id, conversations_today, total_conversations)
  VALUES ($1, 1, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET
    conversations_today = CASE
      WHEN usage_limits.last_reset_date < CURRENT_DATE THEN 1
      ELSE usage_limits.conversations_today + 1
    END,
    total_conversations = usage_limits.total_conversations + 1,
    last_reset_date = CURRENT_DATE,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_usage_limits_user_id ON public.usage_limits(user_id);
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [isProUser, setIsProUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usageLimits, setUsageLimits] = useState({
    conversationsToday: 0,
    maxConversations: 10,
    maxFileSize: 100, // MB
  });

  useEffect(() => {
    if (user) {
      checkSubscription();
      checkUsageLimits();
    } else {
      setSubscription(null);
      setIsProUser(false);
      setLoading(false);
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
        setSubscription(data);
        setIsProUser(true);
        setUsageLimits(prev => ({
          ...prev,
          maxConversations: Infinity,
          maxFileSize: 500, // 500MB for pro users
        }));
      } else {
        setIsProUser(false);
      }
    } catch (err) {
      console.log('No active subscription');
      setIsProUser(false);
    } finally {
      setLoading(false);
    }
  };

  const checkUsageLimits = async () => {
    try {
      // Get current usage
      const { data: usageData } = await supabase
        .from('usage_limits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (usageData) {
        // Reset if it's a new day
        const today = new Date().toDateString();
        const lastReset = new Date(usageData.last_reset_date).toDateString();

        if (today !== lastReset) {
          // Reset daily count
          await supabase
            .from('usage_limits')
            .update({
              conversations_today: 0,
              last_reset_date: new Date().toISOString(),
            })
            .eq('user_id', user.id);

          setUsageLimits(prev => ({
            ...prev,
            conversationsToday: 0,
          }));
        } else {
          setUsageLimits(prev => ({
            ...prev,
            conversationsToday: usageData.conversations_today || 0,
          }));
        }
      } else {
        // Create initial usage record
        await supabase
          .from('usage_limits')
          .insert({
            user_id: user.id,
            conversations_today: 0,
            total_conversations: 0,
          });
      }
    } catch (err) {
      console.error('Error checking usage limits:', err);
    }
  };

  const incrementConversation = async () => {
    if (!user) return false;

    // Check if user has reached limit
    if (!isProUser && usageLimits.conversationsToday >= usageLimits.maxConversations) {
      return false; // Limit reached
    }

    try {
      await supabase.rpc('increment_conversation_count', {
        user_id: user.id,
      });

      setUsageLimits(prev => ({
        ...prev,
        conversationsToday: prev.conversationsToday + 1,
      }));

      return true;
    } catch (err) {
      console.error('Error incrementing conversation count:', err);
      return false;
    }
  };

  const canUploadFile = (fileSizeMB) => {
    return fileSizeMB <= usageLimits.maxFileSize;
  };

  const canStartConversation = () => {
    return isProUser || usageLimits.conversationsToday < usageLimits.maxConversations;
  };

  const getRemainingConversations = () => {
    if (isProUser) return Infinity;
    return Math.max(0, usageLimits.maxConversations - usageLimits.conversationsToday);
  };

  return {
    subscription,
    isProUser,
    loading,
    usageLimits,
    incrementConversation,
    canUploadFile,
    canStartConversation,
    getRemainingConversations,
  };
}
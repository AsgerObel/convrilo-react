import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useConversions = () => {
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch user's conversions
  const fetchConversions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setConversions(data || []);
    } catch (error) {
      console.error('Error fetching conversions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new conversion record
  const createConversion = async (conversionData) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const { data, error } = await supabase
        .from('conversions')
        .insert([
          {
            user_id: user.id,
            original_filename: conversionData.originalFilename,
            original_format: conversionData.originalFormat,
            target_format: conversionData.targetFormat,
            original_size: conversionData.originalSize,
            original_file_path: conversionData.originalFilePath,
            conversion_options: conversionData.options || {},
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local state
      setConversions(prev => [data, ...prev]);

      return data;
    } catch (error) {
      console.error('Error creating conversion:', error);
      throw error;
    }
  };

  // Update conversion status
  const updateConversion = async (conversionId, updates) => {
    try {
      const { data, error } = await supabase
        .from('conversions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversionId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setConversions(prev =>
        prev.map(conv =>
          conv.id === conversionId ? data : conv
        )
      );

      return data;
    } catch (error) {
      console.error('Error updating conversion:', error);
      throw error;
    }
  };

  // Mark conversion as completed
  const completeConversion = async (conversionId, convertedFilePath, convertedSize) => {
    return updateConversion(conversionId, {
      status: 'completed',
      converted_file_path: convertedFilePath,
      converted_size: convertedSize,
      completed_at: new Date().toISOString()
    });
  };

  // Mark conversion as failed
  const failConversion = async (conversionId, errorMessage) => {
    return updateConversion(conversionId, {
      status: 'failed',
      error_message: errorMessage
    });
  };

  // Get conversion statistics
  const getStats = () => {
    const totalConversions = conversions.length;
    const completedConversions = conversions.filter(c => c.status === 'completed').length;
    const failedConversions = conversions.filter(c => c.status === 'failed').length;
    const pendingConversions = conversions.filter(c => c.status === 'pending').length;

    return {
      total: totalConversions,
      completed: completedConversions,
      failed: failedConversions,
      pending: pendingConversions,
      successRate: totalConversions > 0 ? Math.round((completedConversions / totalConversions) * 100) : 0
    };
  };

  // Fetch conversions when user changes
  useEffect(() => {
    if (user) {
      fetchConversions();
    } else {
      setConversions([]);
    }
  }, [user]);

  return {
    conversions,
    loading,
    createConversion,
    updateConversion,
    completeConversion,
    failConversion,
    fetchConversions,
    stats: getStats()
  };
};
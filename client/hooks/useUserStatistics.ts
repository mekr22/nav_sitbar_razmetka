import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { calculateTotalXP, getCurrentLevel, UserStatistics } from '@/lib/xpCalculations';

export interface UserStatsWithCalculations extends UserStatistics {
  total_xp: number;
  current_level: number;
  level_info: {
    level: number;
    name: string;
    nextLevelXP: number;
    currentLevelXP: number;
    progressPercent: number;
  };
}

export function useUserStatistics() {
  const { session } = useAuth();
  const [stats, setStats] = useState<UserStatsWithCalculations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create default stats if user doesn't have any
        const defaultStats: Partial<UserStatistics> = {
          likes_count: 0,
          comments_count: 0,
          views_count: 0,
          favorites_count: 0,
          paid_posts: 0,
          bought_posts: 0,
          sold_posts: 0,
          followers_count: 0,
          following_count: 0,
          items_for_sale: 0,
          items_sold: 0,
          items_bought: 0,
        };

        const { data: newStats, error: createError } = await supabase
          .from('user_statistics')
          .insert({
            user_id: session.user.id,
            ...defaultStats,
            total_xp: 0,
            current_level: 1,
          })
          .select()
          .single();

        if (createError) throw createError;
        data = newStats;
      }

      // Calculate XP and level
      const totalXP = calculateTotalXP(data);
      const levelInfo = getCurrentLevel(totalXP);

      const statsWithCalculations: UserStatsWithCalculations = {
        ...data,
        total_xp: totalXP,
        current_level: levelInfo.level,
        level_info: levelInfo,
      };

      setStats(statsWithCalculations);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch statistics';
      setError(message);
      console.error('Error fetching user statistics:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const updateStatistics = useCallback(
    async (updates: Partial<UserStatistics>) => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_statistics')
          .update(updates)
          .eq('user_id', session.user.id)
          .select()
          .single();

        if (error) throw error;

        // Recalculate XP and level
        const totalXP = calculateTotalXP(data);
        const levelInfo = getCurrentLevel(totalXP);

        const statsWithCalculations: UserStatsWithCalculations = {
          ...data,
          total_xp: totalXP,
          current_level: levelInfo.level,
          level_info: levelInfo,
        };

        setStats(statsWithCalculations);
        return statsWithCalculations;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update statistics';
        setError(message);
        console.error('Error updating user statistics:', err);
        throw err;
      }
    },
    [session?.user?.id]
  );

  return {
    stats,
    loading,
    error,
    fetchStatistics,
    updateStatistics,
  };
}

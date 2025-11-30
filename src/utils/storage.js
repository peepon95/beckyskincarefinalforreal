import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const KEYS = {
  SKIN_ANALYSIS: '@skincare_skin_analysis',
  ROUTINES: '@skincare_routines',
  USER_PROFILE: '@skincare_user_profile',
  SAVED_SCANS: '@skincare_saved_scans',
};

// Helper to get current user
const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.log('No user logged in');
    return null;
  }
};

const storage = {
  async saveSkinAnalysis(data) {
    try {
      // Always save to localStorage first (backup)
      await AsyncStorage.setItem(KEYS.SKIN_ANALYSIS, JSON.stringify(data));
      console.log('💾 Skin analysis saved to localStorage');

      // If user is logged in, also save to Supabase
      const user = await getCurrentUser();
      if (user) {
        try {
          const { error } = await supabase
            .from('scans')
            .insert({
              user_id: user.id,
              skin_type: data.skin_type,
              health_score: data.healthScore,
              key_concerns: data.key_concerns,
              recommendations: data.recommendations,
              action_plan: data.action_plan,
            });

          if (error) {
            console.error('Error saving to Supabase:', error);
          } else {
            console.log('✅ Scan saved to Supabase database');
          }
        } catch (supabaseError) {
          console.error('Supabase save failed, using localStorage only:', supabaseError);
        }
      }
    } catch (error) {
      console.error('Error saving skin analysis:', error);
      throw error;
    }
  },

  async getSkinAnalysis() {
    try {
      const user = await getCurrentUser();

      // If logged in, try to get from Supabase first
      if (user) {
        try {
          const { data, error } = await supabase
            .from('scans')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (!error && data) {
            console.log('📊 Loaded scan from Supabase');
            return {
              skin_type: data.skin_type,
              healthScore: data.health_score,
              key_concerns: data.key_concerns,
              recommendations: data.recommendations,
              action_plan: data.action_plan,
            };
          }
        } catch (supabaseError) {
          console.log('Supabase fetch failed, using localStorage:', supabaseError);
        }
      }

      // Fallback to localStorage
      const data = await AsyncStorage.getItem(KEYS.SKIN_ANALYSIS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting skin analysis:', error);
      return null;
    }
  },

  async saveRoutines(data) {
    try {
      await AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(data));
      console.log('💾 Routines saved to storage');
    } catch (error) {
      console.error('Error saving routines:', error);
      throw error;
    }
  },

  async getRoutines() {
    try {
      const data = await AsyncStorage.getItem(KEYS.ROUTINES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting routines:', error);
      return null;
    }
  },

  async saveUserProfile(data) {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(data));
      console.log('💾 User profile saved to storage');
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  },

  async getUserProfile() {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  async saveScan(scanData) {
    try {
      // Save to localStorage
      const existingScans = await this.getSavedScans();
      const updatedScans = [scanData, ...existingScans].slice(0, 5);
      await AsyncStorage.setItem(KEYS.SAVED_SCANS, JSON.stringify(updatedScans));
      console.log('💾 Scan saved to localStorage');

      // If logged in, also save to Supabase
      const user = await getCurrentUser();
      if (user && scanData.skinAnalysis) {
        try {
          const { error } = await supabase
            .from('scans')
            .insert({
              user_id: user.id,
              skin_type: scanData.skinAnalysis.skin_type,
              health_score: scanData.skinAnalysis.healthScore,
              key_concerns: scanData.skinAnalysis.key_concerns,
              recommendations: scanData.skinAnalysis.recommendations,
              action_plan: scanData.skinAnalysis.action_plan,
            });

          if (error) {
            console.error('Error saving scan to Supabase:', error);
          } else {
            console.log('✅ Scan saved to Supabase database');
          }
        } catch (supabaseError) {
          console.error('Supabase save failed:', supabaseError);
        }
      }
    } catch (error) {
      console.error('Error saving scan:', error);
      throw error;
    }
  },

  async getSavedScans() {
    try {
      const user = await getCurrentUser();

      // If logged in, get from Supabase
      if (user) {
        try {
          const { data, error } = await supabase
            .from('scans')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

          if (!error && data) {
            console.log(`📊 Loaded ${data.length} scans from Supabase`);
            // Transform Supabase data to match expected format
            return data.map(scan => ({
              unique_id: scan.id,
              created_at: scan.created_at,
              display_title: `Scan from ${new Date(scan.created_at).toLocaleDateString()}`,
              skin_type: scan.skin_type,
              key_concerns: scan.key_concerns,
              healthScore: scan.health_score,
              skinAnalysis: {
                skin_type: scan.skin_type,
                healthScore: scan.health_score,
                key_concerns: scan.key_concerns,
                recommendations: scan.recommendations,
                action_plan: scan.action_plan,
              },
            }));
          }
        } catch (supabaseError) {
          console.log('Supabase fetch failed, using localStorage:', supabaseError);
        }
      }

      // Fallback to localStorage
      const data = await AsyncStorage.getItem(KEYS.SAVED_SCANS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting saved scans:', error);
      return [];
    }
  },

  async deleteScan(scanId) {
    try {
      // Delete from localStorage
      const existingScans = await this.getSavedScans();
      const updatedScans = existingScans.filter(s => s.unique_id !== scanId);
      await AsyncStorage.setItem(KEYS.SAVED_SCANS, JSON.stringify(updatedScans));
      console.log('🗑️ Scan deleted from localStorage');

      // If logged in, also delete from Supabase
      const user = await getCurrentUser();
      if (user) {
        try {
          const { error } = await supabase
            .from('scans')
            .delete()
            .eq('id', scanId)
            .eq('user_id', user.id);

          if (error) {
            console.error('Error deleting from Supabase:', error);
          } else {
            console.log('✅ Scan deleted from Supabase');
          }
        } catch (supabaseError) {
          console.error('Supabase delete failed:', supabaseError);
        }
      }
    } catch (error) {
      console.error('Error deleting scan:', error);
      throw error;
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        KEYS.SKIN_ANALYSIS,
        KEYS.ROUTINES,
        KEYS.USER_PROFILE,
        KEYS.SAVED_SCANS,
      ]);
      console.log('🗑️ All localStorage cleared');

      // Note: We don't clear Supabase data here - that's permanent user data
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};

export default storage;

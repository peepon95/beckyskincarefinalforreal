import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SKIN_ANALYSIS: '@skincare_skin_analysis',
  ROUTINES: '@skincare_routines',
  USER_PROFILE: '@skincare_user_profile',
  SAVED_SCANS: '@skincare_saved_scans',
};

const storage = {
  async saveSkinAnalysis(data) {
    try {
      await AsyncStorage.setItem(KEYS.SKIN_ANALYSIS, JSON.stringify(data));
      console.log('💾 Skin analysis saved to storage');
    } catch (error) {
      console.error('Error saving skin analysis:', error);
      throw error;
    }
  },

  async getSkinAnalysis() {
    try {
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
      const existingScans = await this.getSavedScans();
      const updatedScans = [scanData, ...existingScans].slice(0, 5);
      await AsyncStorage.setItem(KEYS.SAVED_SCANS, JSON.stringify(updatedScans));
      console.log('💾 Scan saved to storage');
    } catch (error) {
      console.error('Error saving scan:', error);
      throw error;
    }
  },

  async getSavedScans() {
    try {
      const data = await AsyncStorage.getItem(KEYS.SAVED_SCANS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting saved scans:', error);
      return [];
    }
  },

  async deleteScan(scanId) {
    try {
      const existingScans = await this.getSavedScans();
      const updatedScans = existingScans.filter(s => s.unique_id !== scanId);
      await AsyncStorage.setItem(KEYS.SAVED_SCANS, JSON.stringify(updatedScans));
      console.log('🗑️ Scan deleted from storage');
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
      console.log('🗑️ All storage cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};

export default storage;

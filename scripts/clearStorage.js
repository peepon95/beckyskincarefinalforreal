// Run this script to clear all cached mock data
// Usage: Open app console and run: require('./scripts/clearStorage').clearAll()

import storage from '../src/utils/storage';

export async function clearAll() {
  console.log('🗑️  Clearing all cached data...');

  try {
    await storage.clearAll();
    console.log('✅ All storage cleared successfully!');
    console.log('📱 Please restart the app to see fresh results');
    return true;
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
    return false;
  }
}

export default { clearAll };

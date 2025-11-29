import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  User,
  Droplet,
  ChevronRight,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  Trash2,
  Home as HomeIcon,
  AlertCircle,
  Activity,
  Calendar,
  TrendingUp,
  ArrowRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from '../src/components/Toast';
import storage from '../src/utils/storage';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
  const [savedScans, setSavedScans] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const loadProfileData = async () => {
    try {
      const scans = await storage.getSavedScans();
      setSavedScans(scans);

      const profile = await storage.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.log('Error loading profile data:', error);
    }
  };

  const getLatestScan = () => {
    if (savedScans.length > 0) {
      return savedScans[0];
    }
    return null;
  };

  const getAverageHealthScore = () => {
    if (savedScans.length === 0) return null;

    const scansWithScores = savedScans.filter(scan => scan.skinAnalysis?.healthScore);
    if (scansWithScores.length === 0) return null;

    const sum = scansWithScores.reduce((acc, scan) => acc + scan.skinAnalysis.healthScore, 0);
    return Math.round(sum / scansWithScores.length);
  };

  const getCommonConcerns = () => {
    if (!userProfile?.concerns || userProfile.concerns.length === 0) {
      const latestScan = getLatestScan();
      if (latestScan?.skinAnalysis?.key_concerns) {
        return latestScan.skinAnalysis.key_concerns.slice(0, 3).map((c: any) => c.name);
      }
      return [];
    }
    return userProfile.concerns;
  };

  const getSkinType = () => {
    if (userProfile?.skinType) return userProfile.skinType;

    const latestScan = getLatestScan();
    if (latestScan?.skinAnalysis?.skin_type) {
      return latestScan.skinAnalysis.skin_type;
    }

    return null;
  };

  const getSensitivities = () => {
    if (userProfile?.sensitivities && userProfile.sensitivities.length > 0) {
      return userProfile.sensitivities;
    }
    return [];
  };

  const handleClearData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all your saved scans, analysis results, and profile data. This action cannot be undone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.clearAll();
              setToast({
                visible: true,
                message: 'All data cleared successfully',
                type: 'success',
              });
              loadProfileData();
            } catch (error) {
              console.error('Error clearing data:', error);
              setToast({
                visible: true,
                message: 'Failed to clear data. Please try again.',
                type: 'error',
              });
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    console.log('Logout clicked');
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to log out?');
      console.log('Logout confirmed:', confirmed);
      if (confirmed) {
        try {
          console.log('Calling signOut...');
          await signOut();
          console.log('SignOut complete, navigating to /');
          // Use replace instead of push to prevent back navigation
          router.replace('/');
        } catch (error) {
          console.error('Error signing out:', error);
        }
      }
    } else {
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
                router.replace('/');
              } catch (error) {
                console.error('Error signing out:', error);
              }
            },
          },
        ]
      );
    }
  };

  const latestScan = getLatestScan();
  const skinType = getSkinType();
  const commonConcerns = getCommonConcerns();
  const sensitivities = getSensitivities();
  const avgHealthScore = getAverageHealthScore();

  return (
    <LinearGradient
      colors={['#F8E8FF', '#FFF0F5', '#F3E8FF']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.profileHeaderContent}>
            <View style={styles.avatarContainer}>
              <User color="#8B5CF6" size={32} strokeWidth={2} />
            </View>
            <View style={styles.profileHeaderText}>
              <Text style={styles.profileName}>
                {user?.email?.split('@')[0] || 'Guest'}
              </Text>
              <Text style={styles.profileSubtext}>
                {user ? `${user.email}` : 'Becky member since 2025'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Skin Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Skin at a Glance</Text>

          <View style={styles.overviewGrid}>
            {/* Skin Type Card */}
            <View style={styles.overviewCard}>
              <View style={styles.overviewIconCircle}>
                <Droplet color="#8B5CF6" size={20} strokeWidth={2} />
              </View>
              <Text style={styles.overviewLabel}>Skin Type</Text>
              <Text style={styles.overviewValue}>
                {skinType || 'Not set yet'}
              </Text>
            </View>

            {/* Common Concerns Card */}
            <View style={styles.overviewCard}>
              <View style={styles.overviewIconCircle}>
                <AlertCircle color="#EC4899" size={20} strokeWidth={2} />
              </View>
              <Text style={styles.overviewLabel}>Common Concerns</Text>
              {commonConcerns.length > 0 ? (
                <Text style={styles.overviewValue} numberOfLines={2}>
                  {commonConcerns.slice(0, 2).join(', ')}
                </Text>
              ) : (
                <Text style={styles.overviewValueEmpty}>Not set yet</Text>
              )}
            </View>

            {/* Sensitivities Card */}
            <View style={styles.overviewCard}>
              <View style={styles.overviewIconCircle}>
                <Activity color="#F59E0B" size={20} strokeWidth={2} />
              </View>
              <Text style={styles.overviewLabel}>Known Sensitivities</Text>
              {sensitivities.length > 0 ? (
                <Text style={styles.overviewValue} numberOfLines={2}>
                  {sensitivities.slice(0, 2).join(', ')}
                </Text>
              ) : (
                <Text style={styles.overviewValueEmpty}>Not set yet</Text>
              )}
            </View>
          </View>
        </View>

        {/* Skin Progress Stats */}
        {savedScans.length > 0 && (
          <View style={styles.statsSection}>
            <View style={styles.statPill}>
              <View style={styles.statIconCircle}>
                <Activity color="#8B5CF6" size={16} strokeWidth={2} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{savedScans.length}</Text>
                <Text style={styles.statLabel}>Total Scans</Text>
              </View>
            </View>

            <View style={styles.statPill}>
              <View style={styles.statIconCircle}>
                <Calendar color="#8B5CF6" size={16} strokeWidth={2} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>
                  {new Date(latestScan.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </Text>
                <Text style={styles.statLabel}>Last Scan</Text>
              </View>
            </View>

            {avgHealthScore && (
              <View style={styles.statPill}>
                <View style={styles.statIconCircle}>
                  <TrendingUp color="#8B5CF6" size={16} strokeWidth={2} />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{avgHealthScore}</Text>
                  <Text style={styles.statLabel}>Avg Score</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Skin History Shortcut */}
        <TouchableOpacity
          style={styles.historyCard}
          onPress={() => router.push('/home')}
          activeOpacity={0.7}
        >
          <View style={styles.historyContent}>
            <View>
              <Text style={styles.historyTitle}>Your Skin History</Text>
              <Text style={styles.historyDescription}>
                Review your past scans and action plans.
              </Text>
            </View>
            <View style={styles.historyButton}>
              <ArrowRight color="#8B5CF6" size={20} strokeWidth={2} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Bell color="#6B7280" size={20} strokeWidth={2} />
                <Text style={styles.settingsItemLabel}>Notifications</Text>
              </View>
              <ChevronRight color="#9CA3AF" size={20} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Lock color="#6B7280" size={20} strokeWidth={2} />
                <Text style={styles.settingsItemLabel}>Privacy & Data</Text>
              </View>
              <ChevronRight color="#9CA3AF" size={20} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <HelpCircle color="#6B7280" size={20} strokeWidth={2} />
                <Text style={styles.settingsItemLabel}>Help & Support</Text>
              </View>
              <ChevronRight color="#9CA3AF" size={20} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsItem}
              onPress={handleClearData}
            >
              <View style={styles.settingsItemLeft}>
                <Trash2 color="#6B7280" size={20} strokeWidth={2} />
                <Text style={styles.settingsItemLabel}>Clear Cached Data</Text>
              </View>
              <ChevronRight color="#9CA3AF" size={20} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingsItem, styles.settingsItemLast]}
              onPress={handleLogout}
            >
              <View style={styles.settingsItemLeft}>
                <LogOut color="#EF4444" size={20} strokeWidth={2} />
                <Text style={[styles.settingsItemLabel, styles.logoutText]}>Log Out</Text>
              </View>
              <ChevronRight color="#EF4444" size={20} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version 1.0.0 · Made with 💜 by Becky</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => router.push('/home')}
          activeOpacity={0.7}
        >
          <HomeIcon color="#9CA3AF" size={24} strokeWidth={2} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} activeOpacity={0.7}>
          <User color="#8B5CF6" size={24} strokeWidth={2} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  profileHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileHeaderText: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 22,
    color: '#1A1A2E',
    marginBottom: 4,
  },
  profileSubtext: {
    fontFamily: 'Lora-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontFamily: 'Lora-Medium',
    fontSize: 14,
    color: '#8B5CF6',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 20,
    color: '#2C2C2C',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  overviewGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  overviewIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewLabel: {
    fontFamily: 'Lora-Medium',
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  overviewValue: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#1A1A2E',
    lineHeight: 22,
  },
  overviewValueEmpty: {
    fontFamily: 'Lora-Regular',
    fontSize: 15,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 10,
  },
  statPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#1A1A2E',
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Lora-Regular',
    fontSize: 11,
    color: '#6B7280',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  historyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  historyTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 18,
    color: '#1A1A2E',
    marginBottom: 6,
  },
  historyDescription: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
  },
  settingsItemLast: {
    borderBottomWidth: 0,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  settingsItemLabel: {
    fontFamily: 'Lora-Medium',
    fontSize: 15,
    color: '#2C2C2C',
  },
  logoutText: {
    color: '#EF4444',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionText: {
    fontFamily: 'Lora-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    alignSelf: 'stretch',
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3E8FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  navLabel: {
    fontFamily: 'Lora-Medium',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  navLabelActive: {
    color: '#8B5CF6',
  },
});

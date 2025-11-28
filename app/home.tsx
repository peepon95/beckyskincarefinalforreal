import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Home as HomeIcon, User, Sparkles, Heart, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import storage from '../src/utils/storage';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [savedAnalysis, setSavedAnalysis] = useState<any>(null);
  const [savedScans, setSavedScans] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadSavedData();
    }, [])
  );

  const loadSavedData = async () => {
    try {
      const analysis = await storage.getSkinAnalysis();
      if (analysis) {
        setSavedAnalysis(analysis);
      }

      const scans = await storage.getSavedScans();
      setSavedScans(scans);
    } catch (error) {
      console.log('Error loading saved data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getLatestScan = () => {
    if (savedScans.length > 0) {
      return savedScans[0];
    }
    return null;
  };

  const latestScan = getLatestScan();

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
        {/* 1. Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}, there 💜</Text>
          <Text style={styles.subtext}>Here's your gentle skin space for today.</Text>
        </View>

        {/* 2. Check Your Skin Card */}
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Camera color="#8B5CF6" size={28} strokeWidth={2} />
          </View>

          <Text style={styles.heroTitle}>Check Your Skin</Text>
          <Text style={styles.heroDescription}>
            Upload a selfie for Becky's AI-powered skin analysis.
          </Text>

          {/* Pills */}
          <View style={styles.pillsContainer}>
            <View style={styles.pill}>
              <Sparkles color="#8B5CF6" size={14} strokeWidth={2} />
              <Text style={styles.pillText}>Personalised insights</Text>
            </View>
            <View style={styles.pill}>
              <Heart color="#EC4899" size={14} strokeWidth={2} />
              <Text style={styles.pillText}>Gentle recommendations</Text>
            </View>
            <View style={styles.pill}>
              <TrendingUp color="#8B5CF6" size={14} strokeWidth={2} />
              <Text style={styles.pillText}>Track your progress</Text>
            </View>
          </View>

          {/* Gradient Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/onboarding/photo')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Start New Scan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 3. Stat Bubbles */}
        <View style={styles.summaryStrip}>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryLabel}>SKIN HEALTH SCORE</Text>
            <Text style={styles.summaryValue}>
              {latestScan?.skinAnalysis?.healthScore || '70'}
            </Text>
          </View>



          <View style={styles.summaryPill}>
            <Text style={styles.summaryLabel}>LAST SCAN</Text>
            <Text style={styles.summaryValue}>
              {latestScan
                ? new Date(latestScan.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                : 'Nov 27'}
            </Text>
          </View>
        </View>

        {/* 4. Becky's Gentle Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Text style={styles.tipEmoji}>🌙</Text>
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Becky's gentle tip</Text>
            <Text style={styles.tipText}>
              Your skin loves consistency. Keep things simple and kind today 💜
            </Text>
          </View>
        </View>

        {/* 5. Your Scan History */}
        {savedScans.length > 0 && (
          <View style={styles.savedScansSection}>
            <Text style={styles.sectionTitle}>Your Scan History</Text>
            {savedScans.map((scan) => (
              <TouchableOpacity
                key={scan.unique_id}
                style={styles.scanCard}
                onPress={() => router.push({
                  pathname: '/saved-scan',
                  params: { scanId: scan.unique_id }
                })}
                activeOpacity={0.7}
              >
                <View style={styles.scanCardContent}>
                  <View style={styles.scanLeft}>
                    <View style={styles.scanIconContainer}>
                      <Camera color="#8B5CF6" size={20} strokeWidth={2} />
                    </View>
                    <View style={styles.scanDetails}>
                      <Text style={styles.scanTitle}>{scan.display_title}</Text>
                      <Text style={styles.scanSubtext}>
                        {scan.skinAnalysis.skin_type} · {scan.skinAnalysis.key_concerns?.[0]?.name || 'No concerns'}
                      </Text>
                      <Text style={styles.scanCTA}>Tap to view details</Text>
                    </View>
                  </View>

                  <View style={styles.scanThumbnail} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navTab} activeOpacity={0.7}>
          <HomeIcon color="#8B5CF6" size={24} strokeWidth={2} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => router.push('/profile')}
          activeOpacity={0.7}
        >
          <User color="#9CA3AF" size={24} strokeWidth={2} />
          <Text style={styles.navLabel}>Profile</Text>
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
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },

  // 1. Header
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Lora-Bold',
    fontSize: 28,
    color: '#1F2937',
    marginBottom: 4,
  },
  subtext: {
    fontFamily: 'Lora-Regular',
    fontSize: 15,
    color: '#6B7280',
  },

  // 2. Hero Card
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: 'Lora-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 8,
  },
  heroDescription: {
    fontFamily: 'Lora-Regular',
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 22,
  },
  pillsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillText: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    color: '#4B5563',
  },
  primaryButton: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Lora-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },

  // 3. Summary Strip (Stat Bubbles)
  summaryStrip: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryLabel: {
    fontFamily: 'Lora-Regular',
    fontSize: 11,
    color: '#8B5CF6',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontFamily: 'Lora-Bold',
    fontSize: 18,
    color: '#1F2937',
  },

  // 4. Tip Card
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontFamily: 'Lora-Bold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  tipText: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // 5. Scan History
  savedScansSection: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Lora-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 8,
  },
  scanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scanCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scanLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  scanIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanDetails: {
    flex: 1,
  },
  scanTitle: {
    fontFamily: 'Lora-Bold',
    fontSize: 15,
    color: '#1F2937',
    marginBottom: 4,
  },
  scanSubtext: {
    fontFamily: 'Lora-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  scanCTA: {
    fontFamily: 'Lora-Regular',
    fontSize: 13,
    color: '#8B5CF6',
  },
  scanThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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

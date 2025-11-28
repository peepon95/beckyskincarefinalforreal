import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle, AlertCircle, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import storage from '../src/utils/storage';

export default function ActionPlan() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [planData, setPlanData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPlanData();
  }, []);

  const loadPlanData = () => {
    try {
      const data = params.analysisData
        ? JSON.parse(params.analysisData as string)
        : null;

      if (data) {
        setPlanData(data);
      }
    } catch (error) {
      console.error('Error loading plan data:', error);
    }
  };

  const handleSavePlan = async () => {
    if (!planData) return;

    try {
      setIsSaving(true);

      const savedScan = {
        unique_id: Date.now().toString(),
        created_at: new Date().toISOString(),
        display_title: `Scan from ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`,
        photoUri: planData.photoUri,
        skinAnalysis: {
          skin_type: planData.skin_type,
          key_concerns: planData.key_concerns || [],
          overall_assessment: planData.overall_assessment,
          ingredients_to_avoid: planData.ingredients_to_avoid || [],
          ingredients_that_help: planData.ingredients_that_help || [],
          dermatology_advice: planData.dermatology_advice,
          healthScore: planData.healthScore,
        },
        actionPlan: {
          action_plan_steps: planData.action_plan_steps || [],
          quick_tips: planData.quick_tips || [],
        },
      };

      await storage.saveScan(savedScan);

      Alert.alert('Success', 'Skin analysis & action plan saved to your home screen.', [
        { text: 'OK', onPress: () => router.push('/home') }
      ]);
    } catch (error) {
      console.error('Error saving scan:', error);
      Alert.alert('Error', 'Failed to save scan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  if (!planData) {
    return (
      <LinearGradient
        colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
        style={styles.container}
      >
        <View style={styles.errorContainer}>
          <AlertCircle color="#EF4444" size={64} strokeWidth={1.5} />
          <Text style={styles.errorTitle}>No Plan Data</Text>
          <Text style={styles.errorText}>
            No action plan data found. Please complete a skin analysis first.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.errorButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color="#2C2C2C" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Your Action Plan</Text>
            <Text style={styles.subtitle}>
              Based on your skin analysis, here are the steps you can take to support your skin.
            </Text>
          </View>
        </View>

        {/* Action Plan Steps */}
        {planData.action_plan_steps && planData.action_plan_steps.length > 0 && (
          <View style={styles.section}>
            {planData.action_plan_steps.map((step: any, index: number) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepIcon}>
                    <CheckCircle color="#8B5CF6" size={20} strokeWidth={2} />
                  </View>
                  <View style={styles.stepTitleContainer}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(step.priority) }
                      ]}
                    >
                      <Text style={styles.priorityText}>{step.priority}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Quick Tips */}
        {planData.quick_tips && planData.quick_tips.length > 0 && (
          <View style={styles.tipsSection}>
            <View style={styles.tipsSectionHeader}>
              <Sparkles color="#EC4899" size={20} strokeWidth={2} />
              <Text style={styles.tipsTitle}>Quick Tips</Text>
            </View>
            {planData.quick_tips.map((tip: string, index: number) => (
              <View key={index} style={styles.tipRow}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <AlertCircle color="#6B7280" size={18} strokeWidth={2} />
          <Text style={styles.disclaimerText}>
            This action plan provides general skincare guidance only and is not a medical diagnosis.
            For persistent or concerning changes, please consult a qualified dermatologist.
          </Text>
        </View>

        <View style={{ height: 180 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSavePlan}
          disabled={isSaving}
        >
          <Text style={styles.secondaryButtonText}>
            {isSaving ? 'Saving...' : 'Save this plan'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/home')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButtonGradient}
          >
            <Text style={styles.primaryButtonText}>Done</Text>
          </LinearGradient>
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
    paddingBottom: 40,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 24,
    color: '#1A1A2E',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#1A1A2E',
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  priorityText: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  stepDescription: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
    marginLeft: 44,
  },
  tipsSection: {
    backgroundColor: '#FFFBEB',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  tipsTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 17,
    color: '#92400E',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    marginTop: 7,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#78350F',
  },
  disclaimerCard: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disclaimerText: {
    flex: 1,
    fontFamily: 'Lora-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 44,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.5)',
    gap: 12,
  },
  secondaryButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  secondaryButtonText: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#8B5CF6',
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  primaryButtonText: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 24,
    color: '#1A1A2E',
    marginTop: 24,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  errorButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
  },
  errorButtonText: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

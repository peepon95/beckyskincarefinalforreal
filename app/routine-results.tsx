import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertCircle, Sun, Moon, TrendingUp, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import storage from '../src/utils/storage';

export default function RoutineResults() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<'AM' | 'PM'>('AM');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      console.log('📊 Loading skin analysis with action plan...');
      const data = await storage.getSkinAnalysis();
      console.log('✅ Loaded data:', data ? 'Found' : 'Not found');

      if (data && data.actionPlan) {
        setResults(data);
      } else {
        console.warn('⚠️ No action plan found in data');
      }
      setLoading(false);
    } catch (error) {
      console.error('❌ Error loading results:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your action plan...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!results || !results.actionPlan) {
    return (
      <LinearGradient
        colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
        style={styles.container}
      >
        <View style={styles.errorContainer}>
          <AlertCircle color="#EF4444" size={64} strokeWidth={1.5} />
          <Text style={styles.errorTitle}>No Action Plan Available</Text>
          <Text style={styles.errorText}>
            Please complete a skin analysis first to generate your personalized action plan.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.push('/onboarding/photo')}
          >
            <Text style={styles.errorButtonText}>Start Skin Analysis</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const actionPlan = results.actionPlan;
  const currentRoutine = selectedTime === 'AM' ? actionPlan.amRoutine : actionPlan.pmRoutine;

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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/skin-results')} style={styles.backButton}>
            <ArrowLeft color="#2C2C2C" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Your Action Plan</Text>
            <Text style={styles.subtitle}>Personalized dermatologist consultation</Text>
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.introCard}>
          <Text style={styles.introText}>{actionPlan.introduction}</Text>
        </View>

        {/* Skin Type Analysis */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Your Skin Type</Text>
          <View style={styles.skinTypeBadge}>
            <Text style={styles.skinTypeText}>{actionPlan.skinTypeAnalysis.type}</Text>
          </View>
          <Text style={styles.sectionBody}>{actionPlan.skinTypeAnalysis.explanation}</Text>
        </View>

        {/* Detailed Concerns */}
        {actionPlan.concernsDetailed && actionPlan.concernsDetailed.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>What I'm Seeing</Text>
            {actionPlan.concernsDetailed.map((concern: any, index: number) => (
              <View key={index} style={styles.concernDetailCard}>
                <View style={styles.concernDetailHeader}>
                  <Text style={styles.concernName}>{concern.concern}</Text>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(concern.severity) }
                  ]}>
                    <Text style={styles.severityBadgeText}>
                      {concern.severity.charAt(0).toUpperCase() + concern.severity.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.concernLocation}>📍 Location: {concern.location}</Text>
                <Text style={styles.concernAnalysis}>{concern.analysis}</Text>
                <View style={styles.impactBox}>
                  <Text style={styles.impactLabel}>Impact:</Text>
                  <Text style={styles.impactText}>{concern.impact}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* AM/PM Routine Toggle */}
        <View style={styles.timeToggle}>
          <TouchableOpacity
            style={[
              styles.timeTab,
              selectedTime === 'AM' && styles.timeTabActive,
            ]}
            onPress={() => setSelectedTime('AM')}
          >
            <Sun
              color={selectedTime === 'AM' ? '#FFFFFF' : '#6B7280'}
              size={20}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.timeTabText,
                selectedTime === 'AM' && styles.timeTabTextActive,
              ]}
            >
              Morning Routine
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.timeTab,
              selectedTime === 'PM' && styles.timeTabActive,
            ]}
            onPress={() => setSelectedTime('PM')}
          >
            <Moon
              color={selectedTime === 'PM' ? '#FFFFFF' : '#6B7280'}
              size={20}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.timeTabText,
                selectedTime === 'PM' && styles.timeTabTextActive,
              ]}
            >
              Evening Routine
            </Text>
          </TouchableOpacity>
        </View>

        {/* Routine Steps */}
        <View style={styles.routineCard}>
          <Text style={styles.routineTitle}>
            {selectedTime === 'AM' ? '☀️ Morning' : '🌙 Evening'} Routine
          </Text>
          {currentRoutine && currentRoutine.length > 0 ? (
            currentRoutine.map((step: any) => (
              <View key={step.step} style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.step}</Text>
                  </View>
                  <View style={styles.stepHeaderText}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepCategory}>{step.category}</Text>
                  </View>
                </View>
                <Text style={styles.stepInstruction}>{step.instruction}</Text>
                <View style={styles.stepProducts}>
                  <Text style={styles.stepProductsLabel}>Recommended:</Text>
                  <Text style={styles.stepProductsText}>{step.products}</Text>
                </View>
                <View style={styles.stepMeta}>
                  <Text style={styles.stepFrequency}>🔄 {step.frequency}</Text>
                  {step.tips && (
                    <View style={styles.stepTips}>
                      <Text style={styles.stepTipsLabel}>💡 Tip:</Text>
                      <Text style={styles.stepTipsText}>{step.tips}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noRoutineText}>No routine steps available</Text>
          )}
        </View>

        {/* Key Ingredients */}
        {actionPlan.keyIngredients && actionPlan.keyIngredients.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Key Ingredients for You</Text>
            {actionPlan.keyIngredients.map((ingredient: any, index: number) => (
              <View key={index} style={styles.ingredientCard}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientPurpose}>{ingredient.purpose}</Text>
                <Text style={styles.ingredientUsage}>Usage: {ingredient.usage}</Text>
                {ingredient.caution && (
                  <View style={styles.cautionBox}>
                    <Text style={styles.cautionText}>⚠️ {ingredient.caution}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Lifestyle Recommendations */}
        {actionPlan.lifestyleRecommendations && actionPlan.lifestyleRecommendations.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Lifestyle Recommendations</Text>
            {actionPlan.lifestyleRecommendations.map((rec: string, index: number) => (
              <View key={index} style={styles.lifestyleItem}>
                <Text style={styles.lifestyleBullet}>•</Text>
                <Text style={styles.lifestyleText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Progress Tracking */}
        {actionPlan.progressTracking && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>What to Expect</Text>
            <View style={styles.timelineContainer}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineIcon}>
                  <Calendar color="#10B981" size={20} strokeWidth={2} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>Week 2</Text>
                  <Text style={styles.timelineText}>{actionPlan.progressTracking.week2}</Text>
                </View>
              </View>
              <View style={styles.timelineItem}>
                <View style={styles.timelineIcon}>
                  <TrendingUp color="#10B981" size={20} strokeWidth={2} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>Week 6</Text>
                  <Text style={styles.timelineText}>{actionPlan.progressTracking.week6}</Text>
                </View>
              </View>
              <View style={styles.timelineItem}>
                <View style={styles.timelineIcon}>
                  <TrendingUp color="#10B981" size={20} strokeWidth={2} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>Week 12</Text>
                  <Text style={styles.timelineText}>{actionPlan.progressTracking.week12}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* When to See a Dermatologist */}
        {actionPlan.whenToSeeDermatologist && actionPlan.whenToSeeDermatologist.length > 0 && (
          <View style={styles.dermCard}>
            <Text style={styles.dermTitle}>When to See a Dermatologist</Text>
            {actionPlan.whenToSeeDermatologist.map((item: string, index: number) => (
              <View key={index} style={styles.dermItem}>
                <Text style={styles.dermBullet}>•</Text>
                <Text style={styles.dermText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer at the Bottom */}
        {actionPlan.disclaimer && (
          <View style={styles.disclaimerCard}>
            <AlertCircle color="#6B7280" size={20} strokeWidth={2} />
            <Text style={styles.disclaimerText}>{actionPlan.disclaimer}</Text>
          </View>
        )}

        <View style={{ height: 160 }} />
      </ScrollView>

      <View style={styles.bottomActions}>
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
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

function getSeverityColor(severity: string): string {
  switch (severity?.toLowerCase()) {
    case 'severe':
      return '#EF4444';
    case 'moderate':
      return '#F59E0B';
    case 'mild':
      return '#10B981';
    default:
      return '#6B7280';
  }
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 20,
    color: '#1A1A2E',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Lora-Regular',
    fontSize: 13,
    color: '#6B6B7A',
  },
  introCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  introText: {
    fontFamily: 'Lora-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#2C2C2C',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 18,
    color: '#1A1A2E',
    marginBottom: 12,
  },
  sectionBody: {
    fontFamily: 'Lora-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#4A4A5E',
  },
  skinTypeBadge: {
    backgroundColor: '#8B7355',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  skinTypeText: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  concernDetailCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  concernDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  concernName: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#1A1A2E',
    flex: 1,
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  severityBadgeText: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  concernLocation: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  concernAnalysis: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 8,
  },
  impactBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#10B981',
  },
  impactLabel: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 13,
    color: '#10B981',
    marginBottom: 4,
  },
  impactText: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  timeToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  timeTabActive: {
    backgroundColor: '#8B5CF6',
  },
  timeTabText: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 14,
    color: '#6B7280',
  },
  timeTabTextActive: {
    color: '#FFFFFF',
  },
  routineCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  routineTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 18,
    color: '#1A1A2E',
    marginBottom: 16,
  },
  stepCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontFamily: 'Lora-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  stepHeaderText: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#1A1A2E',
    marginBottom: 2,
  },
  stepCategory: {
    fontFamily: 'Lora-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  stepInstruction: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 12,
  },
  stepProducts: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  stepProductsLabel: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 13,
    color: '#8B5CF6',
    marginBottom: 4,
  },
  stepProductsText: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  stepMeta: {
    gap: 8,
  },
  stepFrequency: {
    fontFamily: 'Lora-Medium',
    fontSize: 13,
    color: '#6B7280',
  },
  stepTips: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
  },
  stepTipsLabel: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 12,
    color: '#92400E',
    marginBottom: 4,
  },
  stepTipsText: {
    fontFamily: 'Lora-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: '#78350F',
  },
  noRoutineText: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
  ingredientCard: {
    backgroundColor: '#F1F8F4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ingredientName: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 15,
    color: '#1A1A2E',
    marginBottom: 6,
  },
  ingredientPurpose: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 6,
  },
  ingredientUsage: {
    fontFamily: 'Lora-Medium',
    fontSize: 13,
    color: '#10B981',
    marginBottom: 8,
  },
  cautionBox: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
  },
  cautionText: {
    fontFamily: 'Lora-Regular',
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  lifestyleItem: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  lifestyleBullet: {
    fontFamily: 'Lora-Regular',
    fontSize: 16,
    color: '#8B5CF6',
  },
  lifestyleText: {
    flex: 1,
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  timelineContainer: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 14,
    color: '#10B981',
    marginBottom: 4,
  },
  timelineText: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  dermCard: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dermTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#991B1B',
    marginBottom: 12,
  },
  dermItem: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  dermBullet: {
    fontFamily: 'Lora-Regular',
    fontSize: 16,
    color: '#EF4444',
  },
  dermText: {
    flex: 1,
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#7F1D1D',
  },
  disclaimerCard: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
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
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Lora-Regular',
    fontSize: 16,
    color: '#6B7280',
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

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import storage from '../src/utils/storage';

export default function SkinResults() {
  const router = useRouter();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      console.log('📊 Loading skin analysis results...');
      const data = await storage.getSkinAnalysis();
      console.log('✅ Loaded data:', data ? 'Found' : 'Not found');

      if (data) {
        setResults(data);
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
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!results) {
    return (
      <LinearGradient
        colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
        style={styles.container}
      >
        <View style={styles.errorContainer}>
          <AlertCircle color="#EF4444" size={64} strokeWidth={1.5} />
          <Text style={styles.errorTitle}>No Analysis Data</Text>
          <Text style={styles.errorText}>
            No skin analysis results found. Please take a photo and analyze your skin first.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.push('/onboarding/photo')}
          >
            <Text style={styles.errorButtonText}>Start Analysis</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
      case 'high':
        return '#FEE2E2';
      case 'moderate':
      case 'medium':
        return '#FEF3C7';
      case 'mild':
      case 'low':
        return '#F3F4F6';
      default:
        return '#F3F4F6';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
      case 'high':
        return '#DC2626';
      case 'moderate':
      case 'medium':
        return '#F59E0B';
      case 'mild':
      case 'low':
        return '#4B5563';
      default:
        return '#4B5563';
    }
  };

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
          <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
            <ArrowLeft color="#2C2C2C" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Skin Analysis</Text>
            <Text style={styles.timestamp}>Here is what we found based on your photo.</Text>
          </View>
        </View>

        {/* Photo Section */}
        {results.photoUri && (
          <View style={styles.photoSection}>
            <Image source={{ uri: results.photoUri }} style={styles.photoImage} />
          </View>
        )}

        {/* Summary Pills */}
        <View style={styles.pillsRow}>
          <View style={styles.pillContainer}>
            <Text style={styles.pillLabel}>SKIN HEALTH SCORE</Text>
            <Text style={styles.pillValue}>
              {results.healthScore || '70'}
            </Text>
          </View>

          {results.key_concerns && results.key_concerns.length > 0 && (
            <View style={styles.concernsPillContainer}>
              <Text style={styles.pillLabel}>CONCERNS</Text>
              {results.key_concerns.slice(0, 3).map((concern: any, idx: number) => (
                <Text key={idx} style={styles.concernPill}>{concern.name}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Assessment Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <CheckCircle color="#10B981" size={20} strokeWidth={2} />
            <Text style={styles.sectionTitle}>Assessment</Text>
          </View>
          <Text style={styles.assessmentText}>{results.overall_assessment}</Text>
        </View>

        {/* Concerns Detected */}
        {results.key_concerns && results.key_concerns.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Concerns Detected</Text>
            {results.key_concerns.map((concern: any, index: number) => (
              <View key={index} style={styles.concernCard}>
                <View style={styles.concernHeader}>
                  <Text style={styles.concernName}>{concern.name}</Text>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(concern.severity) }
                    ]}
                  >
                    <Text style={[styles.severityText, { color: getSeverityTextColor(concern.severity) }]}>{concern.severity}</Text>
                  </View>
                </View>
                <Text style={styles.concernLocation}>📍 {concern.location}</Text>
                <Text style={styles.concernDescription}>{concern.short_description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Ingredients to Avoid */}
        {results.ingredients_to_avoid && results.ingredients_to_avoid.length > 0 && (
          <View style={styles.warningCard}>
            <View style={styles.sectionHeader}>
              <AlertTriangle color="#EF4444" size={20} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: '#991B1B' }]}>Ingredients to Avoid</Text>
            </View>
            {results.ingredients_to_avoid.map((ingredient: any, index: number) => (
              <View key={index} style={styles.warningItem}>
                <Text style={styles.warningIngredient}>{ingredient.name}</Text>
                <Text style={styles.warningReason}>{ingredient.reason}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Ingredients That Can Help */}
        {results.ingredients_that_help && results.ingredients_that_help.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Ingredients That Can Help</Text>
            <View style={styles.ingredientsGrid}>
              {results.ingredients_that_help.map((ingredient: any, index: number) => (
                <View key={index} style={styles.ingredientCard}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <Text style={styles.ingredientUse}>{ingredient.use_for}</Text>
                  <View style={styles.productTypeBadge}>
                    <Text style={styles.productTypeText}>{ingredient.product_type}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}


        {/* Dermatology Advice */}
        {results.dermatology_advice && (
          <View style={styles.dermCard}>
            <Text style={styles.dermTitle}>When to See a Dermatologist</Text>
            <Text style={styles.dermText}>{results.dermatology_advice}</Text>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <AlertCircle color="#6B7280" size={18} strokeWidth={2} />
          <Text style={styles.disclaimerText}>
            Becky provides informational skincare insights only and is not a medical diagnosis. Please consult a dermatologist for professional evaluation.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push({
            pathname: '/action-plan',
            params: { analysisData: JSON.stringify(results) }
          })}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButtonGradient}
          >
            <Text style={styles.primaryButtonText}>View Action Plan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
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
  title: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 20,
    color: '#1A1A2E',
    marginBottom: 4,
  },
  timestamp: {
    fontFamily: 'Lora-Regular',
    fontSize: 13,
    color: '#6B6B7A',
  },
  photoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  photoImage: {
    width: '100%',
    maxWidth: 500,
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
  },
  pillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  pillContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  concernsPillContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pillLabel: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 11,
    color: '#8B5CF6',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  pillValue: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#1A1A2E',
  },
  concernPill: {
    fontFamily: 'Lora-Regular',
    fontSize: 12,
    color: '#EC4899',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 17,
    color: '#1A1A2E',
    marginBottom: 12,
  },
  assessmentText: {
    fontFamily: 'Lora-Regular',
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
  },
  concernCard: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  concernHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  concernName: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 15,
    color: '#1A1A2E',
    flex: 1,
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  severityText: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 11,
    color: '#1F2937',
  },
  concernLocation: {
    fontFamily: 'Lora-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  concernDescription: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  warningCard: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: 20,
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
  warningItem: {
    marginBottom: 12,
  },
  warningIngredient: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 15,
    color: '#991B1B',
    marginBottom: 4,
  },
  warningReason: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#7F1D1D',
  },
  ingredientsGrid: {
    gap: 12,
  },
  ingredientCard: {
    backgroundColor: '#F1F8F4',
    padding: 14,
    borderRadius: 12,
  },
  ingredientName: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 14,
    color: '#1A1A2E',
    marginBottom: 6,
  },
  ingredientUse: {
    fontFamily: 'Lora-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: '#374151',
    marginBottom: 8,
  },
  productTypeBadge: {
    backgroundColor: '#D1FAE5',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  productTypeText: {
    fontFamily: 'Lora-Medium',
    fontSize: 11,
    color: '#059669',
  },
  tipItem: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  dermCard: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  dermTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#991B1B',
    marginBottom: 10,
  },
  dermText: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#7F1D1D',
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
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 44,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.5)',
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

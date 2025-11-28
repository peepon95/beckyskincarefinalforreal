import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Typewriter } from '@/components/Typewriter';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { analyzeSkin } from '@/src/services/api';
import { markOnboardingComplete } from '@/src/services/supabase';
import storage from '@/src/utils/storage';
import SkinAnalysisLoader from '@/components/SkinAnalysisLoader';

export default function FinalOnboarding() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartAnalysis = async () => {
    if (!data.photoBase64) {
      Alert.alert('No Image', 'Please go back and take a photo first');
      return;
    }

    try {
      setIsAnalyzing(true);
      console.log('🚀 Starting skin analysis...');

      const results = await analyzeSkin(data.photoBase64);
      console.log('✅ Analysis complete!', results);

      // Include photoUri in saved results
      const dataToSave = {
        ...results,
        photoUri: data.photoUri,
      };

      await storage.saveSkinAnalysis(dataToSave);
      console.log('💾 Results saved to storage');

      // Mark onboarding as complete if user is logged in
      if (user) {
        try {
          await markOnboardingComplete(user.id);
          console.log('✅ Onboarding marked as complete');
        } catch (error) {
          console.error('Error marking onboarding complete:', error);
          // Don't block navigation if this fails
        }
      }

      // Wait a bit for the loader animation
      setTimeout(() => {
        setIsAnalyzing(false);
        router.push('/home');
      }, 1000);

    } catch (error: any) {
      console.error('❌ Analysis error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);

      // Always stop loading state
      setIsAnalyzing(false);

      // Determine user-friendly error message
      let errorMessage = "Becky couldn't analyse your skin right now. Please check your connection and try again.";

      if (error?.message) {
        // Use the error message if it's already user-friendly
        if (error.message.includes("Becky couldn't") ||
          error.message.includes('Please') ||
          error.message.includes('try again')) {
          errorMessage = error.message;
        } else if (error.message.includes('quota') || error.message.includes('429') || error.message.includes('Rate limit')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message.includes('network') || error.message.includes('Network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('API key') || error.message.includes('authentication')) {
          errorMessage = 'Service configuration error. Please contact support.';
        }
      }

      // Show error alert
      Alert.alert(
        'Analysis Failed',
        errorMessage,
        [
          {
            text: 'Try Again',
            onPress: () => handleStartAnalysis(),
            style: 'default'
          },
          {
            text: 'Go Back',
            onPress: () => router.back(),
            style: 'cancel'
          }
        ]
      );
    }
  };

  return (
    <LinearGradient
      colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
      style={styles.container}
    >
      <SkinAnalysisLoader
        visible={isAnalyzing}
        onComplete={() => { }} // Handled in handleStartAnalysis
        minimumDuration={2000}
      />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ArrowLeft color="#2C2C2C" size={24} strokeWidth={2} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>All set, {data.name}!</Text>
          <Typewriter
            text="Becky is ready to analyze your unique skin profile."
            speed={50}
            style={styles.heading}
          />
          <Text style={styles.subtext}>
            We'll identify your needs and build a routine just for you.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleStartAnalysis}
          disabled={isAnalyzing}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>
              {isAnalyzing ? 'Analyzing...' : 'Start Skin Analysis'}
            </Text>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    gap: 16,
  },
  greeting: {
    fontFamily: 'Lora-Regular',
    fontSize: 20,
    color: '#6B7280',
  },
  heading: {
    fontFamily: 'Lora-Regular',
    fontSize: 24,
    lineHeight: 32,
    color: '#1A1A2E',
  },
  subtext: {
    fontFamily: 'Lora-Regular',
    fontSize: 18,
    lineHeight: 28,
    color: '#4B5563',
    marginTop: 8,
  },
  footer: {
    padding: 16,
    paddingBottom: 40,
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Lora-SemiBold',
    color: '#FFFFFF',
    fontSize: 18,
  },
});

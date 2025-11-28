import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Typewriter } from '@/components/Typewriter';
import { Camera, Upload, X, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { analyzeSkin } from '@/src/services/api';
import storage from '@/src/utils/storage';
import SkinAnalysisLoader from '@/components/SkinAnalysisLoader';

export default function PhotoScreen() {
  const router = useRouter();
  const { updateData, data } = useOnboarding();
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [photoUri, setPhotoUri] = useState<string>('');
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to take photos.');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Photo library permission is needed to upload photos.');
      return false;
    }
    return true;
  };

  const handleOpenCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      if (result.assets[0].base64) {
        setPhotoBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    }
  };

  const handleUploadPhoto = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      if (result.assets[0].base64) {
        setPhotoBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    }
  };

  const handleRetake = () => {
    setPhotoUri('');
    setPhotoBase64('');
  };

  const handleStartAnalysis = async () => {
    if (!photoBase64) {
      Alert.alert('No Image', 'Please take or upload a photo first');
      return;
    }

    try {
      setIsAnalyzing(true);
      console.log('🚀 Starting skin analysis...');

      // Save photo data to context
      updateData({
        photoUri,
        photoBase64
      });

      const results = await analyzeSkin(photoBase64);
      console.log('✅ Analysis complete!', results);

      // Include photoUri in saved results
      const dataToSave = {
        ...results,
        photoUri,
      };

      await storage.saveSkinAnalysis(dataToSave);
      console.log('💾 Results saved to storage');

      // Wait a bit for the loader animation
      setTimeout(() => {
        setIsAnalyzing(false);
        router.push('/skin-results');
      }, 1000);

    } catch (error: any) {
      console.error('❌ Analysis error:', error);
      setIsAnalyzing(false);

      // Determine user-friendly error message
      let errorMessage = "Becky couldn't analyse your skin right now. Please check your connection and try again.";

      if (error?.message) {
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
            onPress: () => handleRetake(),
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Typewriter
            text="Now let's take a closer look at your skin."
            speed={50}
            style={styles.title}
            onComplete={() => {
              setTimeout(() => setShowSecondLine(true), 500);
            }}
          />
          {showSecondLine && (
            <Text style={styles.subtitle}>
              Please take a clear photo of the area you'd like Becky to focus on – for example your cheeks, forehead, chin, or around the mouth.
            </Text>
          )}
        </View>

        {showSecondLine && (
          <>
            <View style={styles.guidelinesList}>
              <Text style={styles.guidelineItem}>• Remove heavy make-up if you can.</Text>
              <Text style={styles.guidelineItem}>• Stand near natural light.</Text>
              <Text style={styles.guidelineItem}>• Fill the frame with the area you care about.</Text>
              <Text style={styles.guidelineItem}>• Avoid filters or beauty modes.</Text>
            </View>

            {photoUri ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                <TouchableOpacity style={styles.removeButton} onPress={handleRetake}>
                  <X color="#FFFFFF" size={20} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.primaryAction} onPress={handleOpenCamera}>
                  <LinearGradient
                    colors={['#8B5CF6', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionGradient}
                  >
                    <Camera color="#FFFFFF" size={24} />
                    <Text style={styles.primaryActionText}>Open Camera</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryAction} onPress={handleUploadPhoto}>
                  <Upload color="#4A4A5E" size={20} />
                  <Text style={styles.secondaryActionText}>Upload a photo instead</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {photoUri && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleStartAnalysis}
            disabled={isAnalyzing}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.nextButtonText}>
                {isAnalyzing ? 'Analyzing...' : 'Start Skin Analysis'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 140,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Lora-Regular',
    fontSize: 20,
    lineHeight: 30,
    color: '#1A1A2E',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Lora-Regular',
    fontSize: 16,
    color: '#6B6B7A',
    lineHeight: 24,
  },
  guidelinesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  guidelineItem: {
    fontFamily: 'Lora-Regular',
    fontSize: 15,
    color: '#4A4A5E',
    lineHeight: 26,
    marginBottom: 8,
  },
  actionsContainer: {
    gap: 16,
  },
  primaryAction: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  primaryActionText: {
    fontFamily: 'Lora-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  secondaryAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  secondaryActionText: {
    fontFamily: 'Lora-Medium',
    color: '#4A4A5E',
    fontSize: 15,
  },
  photoPreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 44,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  nextButton: {
    height: 56,
    borderRadius: 30,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 600,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: 'Lora-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Upload, Sparkles, CheckCircle, AlertTriangle, XCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import ProductAnalysisLoader from '@/components/ProductAnalysisLoader';
import storage from '../src/utils/storage';

type ScanMode = 'single' | 'bulk';

export default function ScanProducts() {
  const router = useRouter();
  const [scanMode, setScanMode] = useState<ScanMode>('single');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skinProfile, setSkinProfile] = useState<any>(null);

  useEffect(() => {
    loadSkinProfile();
  }, []);

  const loadSkinProfile = async () => {
    try {
      const data = await storage.getSkinAnalysis();
      if (data) {
        setSkinProfile({
          skinType: data.skinType,
          concerns: data.concerns?.map((c: any) => c.type) || [],
        });
      }
    } catch (error) {
      console.log('No skin profile found');
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const uri = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      setSelectedImage(uri);
      setImageBase64(`data:image/jpeg;base64,${base64}`);
      console.log('📷 Product image selected and converted to base64');
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const uri = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      setSelectedImage(uri);
      setImageBase64(`data:image/jpeg;base64,${base64}`);
      console.log('📷 Product photo taken and converted to base64');
    }
  };

  const handleAnalyze = () => {
    if (!imageBase64) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }
    console.log('🚀 Starting product analysis...');
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = (success: boolean, error?: string) => {
    setIsAnalyzing(false);

    if (success) {
      console.log('✅ Product analysis successful, navigating to results');
      router.push('/routine-results');
    } else {
      console.error('❌ Product analysis failed:', error);

      let errorMessage = error || 'Product analysis failed. Please try again.';

      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        errorMessage = 'API quota exceeded. Please wait 1 minute and try again, or get a new API key from Google AI Studio.';
      }

      Alert.alert('Analysis Failed', errorMessage);
    }
  };

  const handleManualEntry = () => {
    router.push('/products');
  };

  return (
    <View style={styles.container}>
      <ProductAnalysisLoader
        visible={isAnalyzing}
        imageBase64={imageBase64 || undefined}
        onComplete={handleAnalysisComplete}
        minimumDuration={4000}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft color="#2C2C2C" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Scan Products</Text>
            <Text style={styles.subtitle}>
              Take a photo or upload an image of your skincare products
            </Text>
          </View>
        </View>

        {skinProfile && (
          <View style={styles.profileBanner}>
            <Text style={styles.bannerText}>
              Analyzing for {skinProfile.skinType} skin with {skinProfile.concerns.join(', ')}
            </Text>
          </View>
        )}

        <View style={styles.modeToggleContainer}>
          <TouchableOpacity
            style={[
              styles.modeTab,
              scanMode === 'single' && styles.modeTabActive,
            ]}
            onPress={() => setScanMode('single')}
          >
            <Text
              style={[
                styles.modeTabText,
                scanMode === 'single' && styles.modeTabTextActive,
              ]}
            >
              Single Product
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeTab,
              scanMode === 'bulk' && styles.modeTabActive,
            ]}
            onPress={() => setScanMode('bulk')}
          >
            <Text
              style={[
                styles.modeTabText,
                scanMode === 'bulk' && styles.modeTabTextActive,
              ]}
            >
              Bulk Scan
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewContainer}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
            />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Camera color="#9CA3AF" size={100} strokeWidth={1.5} />
              <Text style={styles.previewText}>
                Position your skincare products in the frame
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          {selectedImage ? (
            <>
              <TouchableOpacity
                style={styles.analyzeButton}
                onPress={handleAnalyze}
              >
                <Text style={styles.analyzeButtonText}>Analyze Products</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.outlineButtonText}>Retake Photo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={takePhoto}
              >
                <Camera color="#FFFFFF" size={20} strokeWidth={2} />
                <Text style={styles.primaryButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outlineButton}
                onPress={pickImageFromGallery}
              >
                <Upload color="#2C2C2C" size={20} strokeWidth={2} />
                <Text style={styles.outlineButtonText}>
                  Upload from Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.manualEntryLink}
                onPress={handleManualEntry}
              >
                <Text style={styles.manualEntryText}>
                  📝 Can't scan? Enter manually
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {!selectedImage && (
          <View style={styles.proTipBox}>
            <Sparkles color="#F59E0B" size={24} strokeWidth={2} />
            <View style={styles.proTipContent}>
              <Text style={styles.proTipTitle}>Pro Tip</Text>
              <Text style={styles.proTipText}>
                Make sure product labels are clearly visible for best results
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E8D8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  profileBanner: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  bannerText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
    maxWidth: 760,
    alignSelf: 'center',
    width: '100%',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 9999,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2C2C2C',
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: '#2C2C2C',
    borderColor: '#2C2C2C',
  },
  modeTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  previewContainer: {
    maxHeight: 500,
    minHeight: 300,
    height: 400,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  previewPlaceholder: {
    flex: 1,
    backgroundColor: '#F8F3E8',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  previewText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  buttonsContainer: {
    marginHorizontal: 20,
    gap: 12,
    alignItems: 'center',
    maxWidth: 760,
    alignSelf: 'center',
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analyzeButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#A8C8A5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButton: {
    width: '100%',
    height: 56,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2C2C2C',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  outlineButtonText: {
    color: '#2C2C2C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  manualEntryLink: {
    paddingVertical: 12,
  },
  manualEntryText: {
    fontSize: 14,
    color: '#A8C8A5',
    fontWeight: '600',
  },
  proTipBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    maxWidth: 760,
    alignSelf: 'center',
    width: '100%',
  },
  proTipContent: {
    flex: 1,
  },
  proTipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  proTipText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

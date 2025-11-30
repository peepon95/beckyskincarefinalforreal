import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Typewriter } from '@/components/Typewriter';
import { LinearGradient } from 'expo-linear-gradient';

const sensitivityOptions = [
  'Fragrance',
  'Alcohol',
  'Exfoliating acids (AHA/BHA)',
  'Retinol',
  "I'm not sure",
  'None of these',
];

export default function SensitivitiesScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [selectedSensitivities, setSelectedSensitivities] = useState<string[]>([]);

  const toggleSensitivity = (sensitivity: string) => {
    setSelectedSensitivities((prev) => {
      if (sensitivity === 'None of these') {
        return prev.includes(sensitivity) ? [] : [sensitivity];
      }

      const filtered = prev.filter(s => s !== 'None of these');

      if (prev.includes(sensitivity)) {
        return filtered.filter((s) => s !== sensitivity);
      }
      return [...filtered, sensitivity];
    });
  };

  const handleNext = () => {
    if (selectedSensitivities.length > 0) {
      updateData({ sensitivities: selectedSensitivities });
      router.push('/onboarding/confidence');
    }
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleSection}>
            <Typewriter
              text="Is your skin sensitive to anything?"
              speed={50}
              style={styles.title}
            />
            <Text style={styles.subtitle}>This helps Becky keep your suggestions gentle.</Text>
          </View>

          <View style={styles.chipsContainer}>
            {sensitivityOptions.map((sensitivity) => {
              const isSelected = selectedSensitivities.includes(sensitivity);

              return (
                <TouchableOpacity
                  key={sensitivity}
                  style={[
                    styles.chip,
                    isSelected && styles.chipSelected,
                  ]}
                  onPress={() => toggleSensitivity(sensitivity)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}>
                    {sensitivity}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  container: {
    flex: 1,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 140,
    maxWidth: 500,
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: 'rgba(74, 74, 94, 0.4)',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  chipText: {
    fontFamily: 'Lora-Medium',
    fontSize: 15,
    color: '#4A4A5E',
  },
  chipTextSelected: {
    fontFamily: 'Lora-SemiBold',
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
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
    maxWidth: 500,
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

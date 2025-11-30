import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Typewriter } from '@/components/Typewriter';
import { LinearGradient } from 'expo-linear-gradient';

const concerns = [
  'Breakouts/Acne',
  'Sensitivity or irritation',
  'Dryness or tightness',
  'Oiliness or shine',
  'Dark spots or uneven tone',
  'Fine lines or ageing',
  "I'm just curious",
];

export default function ConcernsOnboarding() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  };

  const handleNext = () => {
    updateData({ concerns: selectedConcerns });
    router.push('/onboarding/skin-type');
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
            <Text style={styles.greeting}>Hi {data.name},</Text>
            <Typewriter
              text="What does your skin need help with right now?"
              speed={50}
              style={styles.title}
            />
          </View>

          <View style={styles.pillsContainer}>
            {concerns.map((concern) => {
              const isSelected = selectedConcerns.includes(concern);

              return (
                <TouchableOpacity
                  key={concern}
                  style={[
                    styles.pill,
                    isSelected && styles.pillSelected,
                  ]}
                  onPress={() => toggleConcern(concern)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.pillText,
                    isSelected && styles.pillTextSelected,
                  ]}>
                    {concern}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, selectedConcerns.length === 0 && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={selectedConcerns.length === 0}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={[styles.nextButtonText, selectedConcerns.length === 0 && styles.nextButtonTextDisabled]}>
                Next
              </Text>
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
  greeting: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 22,
    color: '#1A1A2E',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Lora-Regular',
    fontSize: 20,
    color: '#4A4A5E',
    lineHeight: 30,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pill: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: 'rgba(74, 74, 94, 0.4)',
    backgroundColor: '#FFFFFF',
  },
  pillSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  pillText: {
    fontFamily: 'Lora-Medium',
    fontSize: 16,
    color: '#4A4A5E',
  },
  pillTextSelected: {
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
  nextButtonDisabled: {
    opacity: 0.5,
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
  nextButtonTextDisabled: {
    opacity: 0.6,
  },
});

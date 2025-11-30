import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Typewriter } from '@/components/Typewriter';
import { LinearGradient } from 'expo-linear-gradient';

const skinTypes = [
  'Oily',
  'Dry',
  'Combination',
  'Normal',
  'Sensitive',
  "I'm not sure",
];

export default function SkinTypeOnboarding() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [selectedType, setSelectedType] = useState<string>('');

  const handleNext = () => {
    if (selectedType) {
      updateData({ skinType: selectedType });
      router.push('/onboarding/sensitivities');
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
              text="How would you describe your skin most days?"
              speed={50}
              style={styles.title}
            />
          </View>

          <View style={styles.cardsContainer}>
            {skinTypes.map((type) => {
              const isSelected = selectedType === type;

              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.card,
                    isSelected && styles.cardSelected,
                  ]}
                  onPress={() => setSelectedType(type)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.cardText,
                    isSelected && styles.cardTextSelected,
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedType && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!selectedType}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={[
                styles.nextButtonText,
                !selectedType && styles.nextButtonTextDisabled,
              ]}>
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
  title: {
    fontFamily: 'Lora-Regular',
    fontSize: 20,
    lineHeight: 30,
    color: '#1A1A2E',
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(74, 74, 94, 0.1)',
    padding: 20,
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3E8FF',
  },
  cardText: {
    fontFamily: 'Lora-Medium',
    fontSize: 18,
    color: '#4A4A5E',
  },
  cardTextSelected: {
    fontFamily: 'Lora-SemiBold',
    color: '#8B5CF6',
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

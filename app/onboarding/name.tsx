import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Typewriter } from '@/components/Typewriter';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function NameScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [name, setName] = useState('');

  const handleNext = () => {
    updateData({ name: name.trim() });
    router.push('/onboarding/concerns');
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
        style={styles.gradientContainer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Typewriter
                text="Let's make this routine yours."
                speed={50}
                style={styles.heading}
              />
              <Text style={styles.subtext}>What should Becky call you?</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="First name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={name.trim().length > 0 ? handleNext : undefined}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.primaryButton, name.trim().length === 0 && styles.primaryButtonDisabled]}
              onPress={handleNext}
              disabled={name.trim().length === 0}
            >
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={[styles.primaryButtonText, name.trim().length === 0 && styles.primaryButtonTextDisabled]}>
                  Next
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  gradientContainer: {
    flex: 1,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  textContainer: {
    marginBottom: 24,
  },
  heading: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 24,
    lineHeight: 32,
    color: '#1A1A2E',
    marginBottom: 12,
  },
  subtext: {
    fontFamily: 'Lora-Regular',
    fontSize: 16,
    color: '#6B6B7A',
  },
  input: {
    fontFamily: 'Lora-Regular',
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1A1A2E',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 44,
    backgroundColor: 'transparent',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  primaryButton: {
    height: 56,
    borderRadius: 30,
    overflow: 'hidden',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Lora-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  primaryButtonTextDisabled: {
    opacity: 0.6,
  },
});

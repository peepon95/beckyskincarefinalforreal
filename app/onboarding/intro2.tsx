import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typewriter } from '@/components/Typewriter';
import { LinearGradient } from 'expo-linear-gradient';

export default function Intro2() {
  const router = useRouter();
  const [showSecondLine, setShowSecondLine] = useState(false);

  return (
    <LinearGradient
      colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View>
          <Typewriter
            text="No more guessing or scrolling through conflicting advice."
            speed={50}
            style={styles.text}
            onComplete={() => {
              setTimeout(() => setShowSecondLine(true), 500);
            }}
          />
          {showSecondLine && (
            <View style={styles.secondLine}>
              <Typewriter
                text="Becky looks at your skin and explains what it actually needs."
                speed={50}
                style={styles.text}
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/onboarding/intro3')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  text: {
    fontFamily: 'Lora-Regular',
    fontSize: 20,
    lineHeight: 30,
    color: '#1A1A2E',
    textAlign: 'center',
  },
  secondLine: {
    marginTop: 24,
  },
  footer: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  primaryButton: {
    height: 56,
    borderRadius: 30,
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
    fontSize: 16,
  },
});

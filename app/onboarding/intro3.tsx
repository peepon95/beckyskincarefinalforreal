import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typewriter } from '@/components/Typewriter';
import { LinearGradient } from 'expo-linear-gradient';

export default function Intro3() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Typewriter
          text="We'll ask a few quick questions and then take a closer look at your skin together."
          speed={50}
          style={styles.text}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/onboarding/name')}
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

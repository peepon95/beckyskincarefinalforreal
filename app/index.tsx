import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Typewriter } from '@/components/Typewriter';
import { useAuth } from '@/contexts/AuthContext';

export default function Welcome() {
  const router = useRouter();
  const { user, loading, hasCompletedOnboarding } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // User is logged in - check if they've completed onboarding
      if (hasCompletedOnboarding === true) {
        // Already completed onboarding - go to home
        router.replace('/home');
      } else if (hasCompletedOnboarding === false) {
        // Haven't completed onboarding - show onboarding flow
        router.replace('/onboarding/intro2');
      }
      // If hasCompletedOnboarding is null, we're still loading profile data
    }
  }, [user, loading, hasCompletedOnboarding]);

  if (loading) {
    return (
      <LinearGradient
        colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Typewriter
          text="Welcome to Becky — a calm, judgement-free space for understanding your skin."
          speed={50}
          style={styles.text}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/auth')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/onboarding/intro2')}
        >
          <Text style={styles.skipText}>Continue as guest</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  button: {
    height: 56,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Lora-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipText: {
    fontFamily: 'Lora-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
});


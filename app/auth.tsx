import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = isSignUp
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.replace('/home');
    }
  };



  return (
    <LinearGradient
      colors={['#F8E8FF', '#FFF0F5', '#F3E8FF']}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#2C2C2C" size={24} strokeWidth={2} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.greeting}>Welcome to Becky 💜</Text>
              <Text style={styles.subtext}>
                Your gentle companion for healthier, happier skin.
              </Text>
            </View>

            {/* Auth Card */}
            <View style={styles.authCard}>
              <Text style={styles.authTitle}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Mail color="#8B5CF6" size={20} strokeWidth={2} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Lock color="#8B5CF6" size={20} strokeWidth={2} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              {/* Error Message */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleEmailAuth}
                disabled={loading}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButtonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>
                        {isSignUp ? 'Create Account' : 'Sign In'}
                      </Text>
                      <ArrowRight color="#FFFFFF" size={20} strokeWidth={2} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Toggle Sign Up / Sign In */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                disabled={loading}
              >
                <Text style={styles.toggleText}>
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Skip Option */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.replace('/onboarding/intro2')}
              disabled={loading}
            >
              <Text style={styles.skipText}>Continue without account</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    position: 'relative',
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    width: '100%',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  greeting: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 28,
    color: '#2C2C2C',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtext: {
    fontFamily: 'Lora-Regular',
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  authTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 24,
    color: '#1A1A2E',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Lora-Regular',
    fontSize: 15,
    color: '#1A1A2E',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Lora-Medium',
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  primaryButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  toggleButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleText: {
    fontFamily: 'Lora-Medium',
    fontSize: 14,
    color: '#8B5CF6',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontFamily: 'Lora-Regular',
    fontSize: 13,
    color: '#9CA3AF',
    marginHorizontal: 12,
  },
  oauthContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  oauthButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  oauthButtonText: {
    fontFamily: 'Lora-Medium',
    fontSize: 15,
    color: '#2C2C2C',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipText: {
    fontFamily: 'Lora-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
});

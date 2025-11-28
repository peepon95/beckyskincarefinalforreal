import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail } from 'lucide-react-native';

export default function AuthScreen() {
    const router = useRouter();

    const handleContinue = () => {
        // For now, just navigate to photo screen as we don't have real auth yet
        router.push('/onboarding/photo');
    };

    return (
        <LinearGradient
            colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Before we continue...</Text>
                <Text style={styles.subtitle}>
                    Create an account so Becky can save your skin analysis and future progress.
                </Text>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.authButton} onPress={handleContinue}>
                        <Mail color="#8B5CF6" size={24} />
                        <Text style={styles.authButtonText}>Continue with Email</Text>
                    </TouchableOpacity>
                </View>

                {/* Login link temporarily disabled until login screen is implemented */}
                {/* <TouchableOpacity onPress={() => router.push('/home')}>
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={styles.loginLink}>Log in</Text>
                    </Text>
                </TouchableOpacity> */}
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
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Lora-Regular',
        fontSize: 28,
        lineHeight: 36,
        color: '#1A1A2E',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Lora-Regular',
        fontSize: 16,
        lineHeight: 24,
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 48,
    },
    buttonsContainer: {
        width: '100%',
        gap: 16,
        marginBottom: 48,
    },
    authButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        height: 56,
        borderRadius: 28,
        gap: 12,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    authButtonText: {
        fontFamily: 'Lora-Medium',
        fontSize: 16,
        color: '#1A1A2E',
    },

    loginText: {
        fontFamily: 'Lora-Regular',
        fontSize: 16,
        color: '#4B5563',
    },
    loginLink: {
        fontFamily: 'Lora-SemiBold',
        color: '#8B5CF6',
        textDecorationLine: 'underline',
    },
});

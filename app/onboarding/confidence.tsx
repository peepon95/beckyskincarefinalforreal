import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useState } from 'react';

const CONFIDENCE_LEVELS = [
    'Beginner',
    'Somewhat confident',
    'Very confident',
];

export default function ConfidenceScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleNext = () => {
        if (selected) {
            updateData({ confidenceLevel: selected });
            router.push('/onboarding/photo');
        }
    };

    return (
        <LinearGradient
            colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>
                    How confident do you feel about skincare at the moment?
                </Text>

                <View style={styles.optionsContainer}>
                    {CONFIDENCE_LEVELS.map((level) => (
                        <TouchableOpacity
                            key={level}
                            style={[
                                styles.optionButton,
                                selected === level && styles.optionButtonSelected,
                            ]}
                            onPress={() => setSelected(level)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    selected === level && styles.optionTextSelected,
                                ]}
                            >
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
                    onPress={handleNext}
                    disabled={!selected}
                >
                    <LinearGradient
                        colors={selected ? ['#8B5CF6', '#EC4899'] : ['#E5E7EB', '#E5E7EB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                    </LinearGradient>
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
    },
    title: {
        fontFamily: 'Lora-Regular',
        fontSize: 20,
        lineHeight: 30,
        color: '#1A1A2E',
        marginBottom: 24,
    },
    optionsContainer: {
        gap: 16,
    },
    optionButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    optionButtonSelected: {
        borderColor: '#8B5CF6',
        backgroundColor: '#F3F0FF',
    },
    optionText: {
        fontFamily: 'Lora-Regular',
        fontSize: 18,
        color: '#1A1A2E',
    },
    optionTextSelected: {
        fontFamily: 'Lora-Medium',
        color: '#8B5CF6',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 44,
        backgroundColor: 'transparent',
    },
    nextButton: {
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        fontFamily: 'Lora-SemiBold',
        color: '#FFFFFF',
        fontSize: 18,
    },
});

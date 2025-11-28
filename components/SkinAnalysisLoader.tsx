import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const LOADING_MESSAGES = [
  'Analyzing your skin...',
  'Identifying concerns...',
  'Checking skin type...',
  'Preparing recommendations...',
  'Almost there...',
];

interface SkinAnalysisLoaderProps {
  visible: boolean;
  onComplete?: () => void;
  minimumDuration?: number;
}

export default function SkinAnalysisLoader({
  visible,
  onComplete,
  minimumDuration = 4000,
}: SkinAnalysisLoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        false
      );

      const messageInterval = setInterval(() => {
        setOpacity(0);

        setTimeout(() => {
          setCurrentMessageIndex((prev) =>
            prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
          );
          setOpacity(1);
        }, 300);
      }, 2500);

      const minimumTimer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, minimumDuration);

      return () => {
        clearInterval(messageInterval);
        clearTimeout(minimumTimer);
      };
    } else {
      setCurrentMessageIndex(0);
      setOpacity(1);
    }
  }, [visible, onComplete, minimumDuration]);

  const animatedIconStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const progressAnimation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      progressAnimation.value = withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        false
      );
    }
  }, [visible]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateX: progressAnimation.value * 320 }],
    };
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <LinearGradient
        colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <Animated.View style={animatedIconStyle}>
            <Sparkles color="#A8C8A5" size={80} strokeWidth={1.5} />
          </Animated.View>

          <Text
            style={[
              styles.message,
              { opacity },
            ]}
          >
            {LOADING_MESSAGES[currentMessageIndex]}
          </Text>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  animatedProgressStyle,
                ]}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 48,
    width: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  message: {
    fontFamily: 'Lora-Regular',
    fontSize: 18,
    color: '#1A1A2E',
    fontWeight: '500',
    marginTop: 24,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    marginTop: 24,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    position: 'absolute',
    width: 80,
    height: 4,
    backgroundColor: '#A8C8A5',
    borderRadius: 2,
    left: -80,
  },
});


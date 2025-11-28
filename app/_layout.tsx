import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { useFonts, Lora_400Regular, Lora_500Medium, Lora_600SemiBold, Lora_700Bold } from '@expo-google-fonts/lora';
import { SplashScreen } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Lora-Regular': Lora_400Regular,
    'Lora-Medium': Lora_500Medium,
    'Lora-SemiBold': Lora_600SemiBold,
    'Lora-Bold': Lora_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <OnboardingProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="onboarding/intro1" />
          <Stack.Screen name="onboarding/intro2" />
          <Stack.Screen name="onboarding/intro3" />
          <Stack.Screen name="onboarding/name" />
          <Stack.Screen name="onboarding/concerns" />
          <Stack.Screen name="onboarding/skin-type" />
          <Stack.Screen name="onboarding/sensitivities" />
          <Stack.Screen name="onboarding/photo" />
          <Stack.Screen name="onboarding/final" />
          <Stack.Screen name="home" />
          <Stack.Screen name="skin-check" />
          <Stack.Screen name="skin-results" />
          <Stack.Screen name="action-plan" />
          <Stack.Screen name="saved-scan" />
          <Stack.Screen name="scan-products" />
          <Stack.Screen name="routine-results" />
          <Stack.Screen name="products" />
          <Stack.Screen name="routines" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="dark" />
      </OnboardingProvider>
    </AuthProvider>
  );
}

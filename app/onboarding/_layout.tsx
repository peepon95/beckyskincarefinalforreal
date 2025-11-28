import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="intro1" />
      <Stack.Screen name="intro2" />
      <Stack.Screen name="intro3" />
      <Stack.Screen name="name" />
      <Stack.Screen name="concerns" />
      <Stack.Screen name="skin-type" />
      <Stack.Screen name="sensitivities" />
      <Stack.Screen name="photo" />
      <Stack.Screen name="final" />
    </Stack>
  );
}

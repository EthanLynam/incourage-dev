import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="(settings)/settings"
        options={{
          title: 'Settings',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}

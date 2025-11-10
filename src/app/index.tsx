import { auth } from '@/firebase-config';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

const MIN_DISPLAY_TIME = 1500; // 2.5 seconds in milliseconds

export default function Landing() {
  const router = useRouter();
  const [authStateDetermined, setAuthStateDetermined] = useState(false);
  const [user, setUser] = useState<any>(null);
  const mountTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthStateDetermined(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authStateDetermined) return;

    const elapsed = Date.now() - mountTimeRef.current;
    const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    const redirectTimer = setTimeout(() => {
      if (user) {
        router.replace('/home'); // redirect to main app (tab layout)
      } else {
        router.replace('/login'); // redirect to login
      }
    }, remainingTime);

    return () => clearTimeout(redirectTimer);
  }, [authStateDetermined, user, router]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#FFD700" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#151718',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

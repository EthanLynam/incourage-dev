import { getApps, initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
// @react-native only
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth/react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyAlKTVAVMOR5rPaHvizX_CdQADPqejF2Us',
  authDomain: 'incourage-mvp-dev.firebaseapp.com',
  projectId: 'incourage-mvp-dev',
  appId: '1:415365293982:web:6f3c9f37cf21c6776f588f',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Web vs React Native auth init
let auth = (() => {
  try {
    // @ts-expect-error: window is undefined on native
    if (typeof window !== 'undefined') {
      const a = getAuth(app);
      setPersistence(a, browserLocalPersistence);
      return a;
    }
  } catch {}
  return initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
})();

export { app, auth };


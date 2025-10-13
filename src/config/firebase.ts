// src/config/firebase.ts
import { getApps, initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAlKTVAVMOR5rPaHvizX_CdQADPqejF2Us',
  authDomain: 'incourage-mvp-dev.firebaseapp.com',
  projectId: 'incourage-mvp-dev',
  appId: '1:415365293982:web:6f3c9f37cf21c6776f588f',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize a single auth instance. Use web persistence only on web.
const auth = getAuth(app);
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}

export { app, auth };


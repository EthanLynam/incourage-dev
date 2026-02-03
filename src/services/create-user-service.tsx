import { auth, db } from '@/firebase-config';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

export interface SignUpParams {
  email: string;
  password: string;
  username: string;
}

/**
 * Creates a Firebase Auth user and a user profile document in Firestore.
 * Username is stored in lowercase.
 * @throws Error with message on failure (e.g. auth/email-already-in-use)
 */
export async function createUser({
  email,
  password,
  username,
}: SignUpParams): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  await setDoc(doc(db, 'users', uid), {
    uid,
    username: username.trim().toLowerCase(),
    email: credential.user.email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return credential;
}

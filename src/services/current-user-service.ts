import { auth, db } from '@/firebase-config';
import { doc, getDoc } from 'firebase/firestore';

export interface CurrentUserInfo {
  uid: string;
  username: string | null;
}

/**
 * Returns the currently authenticated user's UID and username.
 * Username is read from the `users` collection, where it is stored
 * in lowercase by the sign-up flow.
 *
 * @returns CurrentUserInfo if a user is logged in, otherwise null.
 */
export async function getCurrentUserInfo(): Promise<CurrentUserInfo | null> {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const uid = user.uid;
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Fallback: user is authenticated but no Firestore document found.
    return { uid, username: null };
  }

  const data = userSnap.data() as { username?: string | null };

  return {
    uid,
    username: data.username ?? null,
  };
}


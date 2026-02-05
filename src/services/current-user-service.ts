import { auth, db } from '@/firebase-config';
import { doc, getDoc } from 'firebase/firestore';

export interface CurrentUserInfo {
  uid: string;
  username: string | null;
  profilePictureUrl: string | null;
}

/** In-memory cache so we don't re-read Firestore on every use. Clear on sign out or after profile updates. */
let cachedUserInfo: { uid: string; info: CurrentUserInfo } | null = null;

/**
 * Clears the cached current user info. Call this on sign out and after
 * updating the user's profile (e.g. username or profile picture) so the
 * next getCurrentUserInfo() fetches fresh data.
 */
export function clearCurrentUserCache(): void {
  cachedUserInfo = null;
}

/**
 * Updates specific fields in the cached current user info without refetching from Firestore.
 * This allows the UI to reflect changes immediately after profile updates.
 * 
 * @param updates - Partial user info to merge with the cache (e.g., { profilePictureUrl: newUrl })
 */
export function updateCurrentUserCache(updates: Partial<Omit<CurrentUserInfo, 'uid'>>): void {
  const user = auth.currentUser;
  
  if (!user || !cachedUserInfo || cachedUserInfo.uid !== user.uid) {
    // If no cache exists or UID mismatch, we can't update
    return;
  }

  cachedUserInfo.info = {
    ...cachedUserInfo.info,
    ...updates,
  };
}

/**
 * Returns the currently authenticated user's UID, username, and profile picture URL.
 * Data is read from the `users` collection (username and profilePictureUrl).
 * Result is cached in memory; subsequent calls for the same user return the cache
 * without a Firestore read. Use clearCurrentUserCache() when the user signs out
 * or updates their profile.
 *
 * @returns CurrentUserInfo if a user is logged in, otherwise null.
 */
export async function getCurrentUserInfo(): Promise<CurrentUserInfo | null> {
  const user = auth.currentUser;

  if (!user) {
    cachedUserInfo = null;
    return null;
  }

  const uid = user.uid;

  if (cachedUserInfo?.uid === uid) {
    return cachedUserInfo.info;
  }

  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const info: CurrentUserInfo = { uid, username: null, profilePictureUrl: null };
    cachedUserInfo = { uid, info };
    return info;
  }

  const data = userSnap.data() as {
    username?: string | null;
    profilePictureUrl?: string | null;
  };

  const info: CurrentUserInfo = {
    uid,
    username: data.username ?? null,
    profilePictureUrl: data.profilePictureUrl ?? null,
  };

  cachedUserInfo = { uid, info };
  return info;
}
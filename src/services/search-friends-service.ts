/**
 * TODO: security rules within firebase rules file for adding friends etc,
 * implement requesting and accepting rather than just adding friends,
 * only allow a friend request to be sent once while it is pending (currently writes everytime add is pressed),
 */

import { auth, db } from '@/firebase-config';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

export type SearchFriendResult = {
  uid: string;
  username: string;
} | null;

/**
 * Looks up a user by username using the `usernames` collection.
 * - Username is trimmed and lowercased to match how it's stored.
 * - Returns `null` if username does not exist, maps to current user, or
 *   if the underlying `users/{uid}` doc is missing.
 */
export async function searchFriendByUsername( rawUsername: string ): Promise<SearchFriendResult> {

  const trimmed = rawUsername.trim().toLowerCase();
  if (!trimmed) return null;

  const usernameRef = doc(db, 'usernames', trimmed);
  const usernameSnap = await getDoc(usernameRef);
  if (!usernameSnap.exists()) return null;

  const { uid } = usernameSnap.data() as { uid: string };

  const currentUser = auth.currentUser;
  if (currentUser && uid === currentUser.uid) {
    return null;
  }

  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;

  const { username: storedUsername } = userSnap.data() as { username?: string };

  return {
    uid,
    username: storedUsername ?? trimmed,
  };
}

/**
 * Sends a friend request and adds the friend record in the current user's
 * `users/{currentUid}/friends/{friendUid}` subcollection.
 */
export async function addFriendByUid(friendUid: string): Promise<void> {

  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must be logged in to add friends.');
  }

  const fromUid = currentUser.uid;

  // Keep a simple friend_requests record (can be used later by an inbox UI).
  const requestId = `${fromUid}_${friendUid}`;
  const requestRef = doc(db, 'friend_requests', requestId);
  await setDoc(requestRef, {
    fromUid,
    toUid: friendUid,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

  // Add friend under current user's friends subcollection.
  const friendRef = doc(db, 'users', fromUid, 'friends', friendUid);
  await setDoc(friendRef, {
    friendUid,
    state: 'pending',
    createdAt: serverTimestamp(),
  });
}


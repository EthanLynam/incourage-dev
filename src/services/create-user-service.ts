import { auth, db } from '@/firebase-config';
import { createUserWithEmailAndPassword, deleteUser, UserCredential } from 'firebase/auth';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';

export interface SignUpParams {
  email: string;
  password: string;
  username: string;
}

/** Error code when the chosen username is already taken. */
export const USERNAME_TAKEN_CODE = 'username-taken';

/**
 * Creates a Firebase Auth user and Firestore records in a single atomic flow.
 * - Creates Auth user first (required to get uid).
 * - Runs a transaction: check usernames collection, create username record,
 *   create user document. All succeed or all fail (no race conditions).
 * - If the transaction fails (e.g. username taken), the Auth user is deleted
 *   so no orphan auth account remains.
 * Username is stored in lowercase in both `usernames` and `users` collections.
 * @throws Error with message on failure (e.g. auth/email-already-in-use, username-taken)
 */
export async function createUser({ email, password, username }: SignUpParams): Promise<UserCredential> {

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  const usernameLower = username.trim().toLowerCase();

  try {
    await runTransaction(db, async (transaction) => {
      const usernameRef = doc(db, 'usernames', usernameLower);
      const userRef = doc(db, 'users', uid);

      const usernameSnap = await transaction.get(usernameRef);
      if (usernameSnap.exists()) {
        throw new Error(USERNAME_TAKEN_CODE);
      }

      transaction.set(usernameRef, {
        uid,
        createdAt: serverTimestamp(),
      });
      transaction.set(userRef, {
        uid,
        username: usernameLower,
        email: credential.user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
  } catch (err: unknown) {
    await deleteUser(credential.user);
    if (err instanceof Error && err.message === USERNAME_TAKEN_CODE) {
      throw new Error('This username is already taken. Please choose another.');
    }
    throw err;
  }

  return credential;
}

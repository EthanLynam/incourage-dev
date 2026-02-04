import type { SearchFriendResult } from '@/src/services/search-friends-service';

/**
 * Returns true when we should show the "no user found" state
 * for a given query and result.
 */
export function shouldShowNoUserFound(
  query: string,
  result: SearchFriendResult,
  loading: boolean,
): boolean {
  return !loading && !!query.trim() && !result;
}

/**
 * Normalizes a raw username input for searching.
 * Mirrors how usernames are stored in Firestore.
 */
export function normalizeUsernameInput(value: string): string {
  return value.trim().toLowerCase();
}


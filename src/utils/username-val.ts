/**
 * Username: 3–20 chars, no double _ or ., only letters/numbers/_/.,
 * cannot start or end with _ or .
 */
export const USERNAME_REGEX =
  /^(?=.{3,20}$)(?!.*[_.]{2})[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/;

  /**
 * Returns an error message if the username is invalid, or null if valid.
 */
export function isValidUsername(value: string): string | null {
  const trimmedUsername = value.trim();

  if (!trimmedUsername) {
    return 'Please enter a username.';
  };

  if (!USERNAME_REGEX.test(trimmedUsername)) {
    return 'Username cannot contain special characters.';
  };

  return null;
}
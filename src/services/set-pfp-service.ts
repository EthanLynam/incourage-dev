import { auth, db, storage } from '@/firebase-config';
import { clearCurrentUserCache } from '@/src/services/current-user-service';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

/**
 * Compresses and resizes the image to ~200kb (JPEG, max width 800, quality 0.5).
 * If still large, a second pass re-compresses the first result (no second decode of original).
 */
async function compressToTargetSize(uri: string): Promise<{ uri: string }> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
  );

  const file = await fetch(result.uri);
  const blob = await file.blob();
  
  if (blob.size > 250 * 1024) {
    const smaller = await ImageManipulator.manipulateAsync(
      result.uri,
      [{ resize: { width: 600 } }],
      { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG }
    );
    return smaller;
  }

  return result;
}

/**
 * Picks an image from the library, compresses it to ~200kb, uploads to Firebase Storage,
 * updates the current user's document with the new profile picture URL, and clears the
 * current user cache so the UI reflects the change.
 *
 * @returns The new profile picture URL on success.
 * @throws Error if no user is logged in, permission is denied, or upload/update fails.
 */
export async function setProfilePicture(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to update your profile picture.');
  }

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access the photo library is required.');
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (pickerResult.canceled || !pickerResult.assets?.[0]?.uri) {
    throw new Error('No image selected.');
  }

  const assetUri = pickerResult.assets[0].uri;

  const { uri: compressedUri } = await compressToTargetSize(assetUri);

  const storagePath = `profilePictures/${user.uid}.jpg`;
  const bucket = storage.app.options.storageBucket;
  const encodedPath = encodeURIComponent(storagePath);
  const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodedPath}`;
  
  const idToken = await user.getIdToken();

  // Fetch the file URI to get a blob directly
  const fileResponse = await fetch(compressedUri);
  const blob = await fileResponse.blob();

  // Upload using fetch
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'image/jpeg',
    },
    body: blob,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
  }

  console.log("Upload finished");

  // Get the download URL after upload completes
  const storageRef = ref(storage, storagePath);
  const downloadUrl = await getDownloadURL(storageRef);

  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    profilePictureUrl: downloadUrl,
    updatedAt: serverTimestamp(),
  });

  clearCurrentUserCache();

  return downloadUrl;
}
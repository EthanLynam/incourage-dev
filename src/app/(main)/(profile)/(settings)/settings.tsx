import { auth } from '@/firebase-config';
import { clearCurrentUserCache } from '@/src/services/current-user-service';
import { setProfilePicture } from '@/src/services/set-pfp-service';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [pfpLoading, setPfpLoading] = useState(false);

  const handleSignOut = () => {
    clearCurrentUserCache();
    auth.signOut();
  };

  const handleUpdateProfilePicture = async () => {
    try {
      setPfpLoading(true);
      await setProfilePicture();
      Alert.alert('Success', 'Profile picture updated.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile picture.';
      if (message !== 'No image selected.') {
        Alert.alert('Error', message);
      }
    } finally {
      setPfpLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.settingsText}>settings</Text>
        <TouchableOpacity
          style={[styles.button, pfpLoading && styles.buttonDisabled]}
          onPress={handleUpdateProfilePicture}
          disabled={pfpLoading}
        >
          <Text style={styles.text}>
            {pfpLoading ? 'Updating…' : 'Update profile picture'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  settingsText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700', // Yellow highlight to match theme
    marginBottom: 40,
  },
  button: {
    width: '90%',
    backgroundColor: '#5C6BC0',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6BC0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 15,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});


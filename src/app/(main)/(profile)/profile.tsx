import { getCurrentUserInfo } from '@/src/services/current-user-service';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const defaultProfileImage = require('@/assets/images/default-profile-picture.jpg');

export default function ProfileScreen() {
  const [username, setUsername] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const info = await getCurrentUserInfo();
        if (info) {
          setUsername(info.username);
          setProfilePictureUrl(info.profilePictureUrl);
        } else {
          setUsername(null);
          setProfilePictureUrl(null);
        }
      } catch (error) {
        console.error('Failed to load current user info', error);
        setUsername(null);
        setProfilePictureUrl(null);
      }
    };

    loadUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top-right settings cog button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsIconButton}
            onPress={() => router.push('/(settings)/settings' as any)}
          >
            <Text style={styles.settingsIconText}>{'\u2699'}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile row with avatar on the left and username on the right */}
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profilePictureUrl
                  ? { uri: profilePictureUrl }
                  : defaultProfileImage
              }
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.usernameText}>
            {username ?? 'User'}
          </Text>
        </View>
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
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  settingsIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5C6BC0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6BC0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  settingsIconText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginRight: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  worksText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700', // Yellow highlight to match theme
    marginBottom: 40,
  },
  settingsButton: {
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
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  // COMMENTED OUT: Original styles for Firestore functionality
  /*
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA726',
    shadowColor: '#FFA726',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5C6BC0',
    shadowColor: '#5C6BC0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    marginLeft: 10,
  },
  */
});

import { auth } from '@/firebase-config';
import type { SearchFriendResult } from '@/src/services/search-friends-service';
import { addFriendByUid, searchFriendByUsername } from '@/src/services/search-friends-service';
import { shouldShowNoUserFound } from '@/src/utils/search-friends-utils';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SEARCH_DEBOUNCE_MS = 400;

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchFriendResult>(null);
  const [loading, setLoading] = useState(false);
  const [addingUid, setAddingUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.replace('/');
    });
    return unsubscribe;
  }, []);

  const searchByUsername = useCallback(async (username: string) => {
    if (!username.trim()) {
      setSearchResult(null);
      return;
    }
    setLoading(true);
    setSearchResult(null);
    try {
      const result = await searchFriendByUsername(username);
      setSearchResult(result);
    } catch (error) {
      console.error('Error searching friend by username', error);
      setSearchResult(null);
      Alert.alert('Error', 'Something went wrong while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      searchByUsername(query);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query, searchByUsername]);

  const handleAddFriend = async (uid: string) => {
    if (!auth.currentUser) return;
    setAddingUid(uid);
    try {
      await addFriendByUid(uid);
      Alert.alert('Sent', 'Friend added to your friends list.');
    } catch (error) {
      console.error('Error adding friend', error);
      Alert.alert('Error', 'Could not add friend.');
    } finally {
      setAddingUid(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by username..."
          placeholderTextColor="#9E9E9E"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.description}>
          add your friends by their username.
        </Text>
        {loading && (
          <View style={styles.resultRow}>
            <ActivityIndicator size="small" color="#5C6BC0" />
          </View>
        )}
        {!loading && searchResult && (
          <View style={styles.resultRow}>
            <Text style={styles.resultUsername}>{searchResult.username}</Text>
            <TouchableOpacity
              style={[
                styles.addButton,
                addingUid === searchResult.uid && styles.addButtonDisabled,
              ]}
              onPress={() => handleAddFriend(searchResult.uid)}
              disabled={addingUid === searchResult.uid}
            >
              <Text style={styles.addButtonText}>
                {addingUid === searchResult.uid ? 'Sending…' : 'add friend +'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {shouldShowNoUserFound(query, searchResult, loading) && (
          <Text style={styles.noResult}>No user found with that username.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  searchBar: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1A237E',
    borderWidth: 1,
    borderColor: '#E8EAF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  description: {
    marginTop: 16,
    fontSize: 15,
    color: '#5C6BC0',
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EAF6',
  },
  resultUsername: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A237E',
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#5C6BC0',
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  noResult: {
    marginTop: 24,
    fontSize: 15,
    color: '#9E9E9E',
    textAlign: 'center',
  },
});

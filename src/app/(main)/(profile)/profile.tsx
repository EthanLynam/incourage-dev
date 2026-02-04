import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// COMMENTED OUT: Firestore database functionality
/*
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../../firebase-config';
import { TextInput, TouchableOpacity, FlatList } from 'react-native';

export default function TabTwoScreen() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<any>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const todosCollection = collection(db, 'todos');

  useEffect(() => {
    fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    if (user) {
      const q = query(todosCollection, where("userId", "==", user.uid));
      const data = await getDocs(q);
      setTodos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } else {
      console.log("No user logged in");
    }
  };

  const addTodo = async () => {
    if (user) {
      await addDoc(todosCollection, { task, completed: false, userId: user.uid });
      setTask('');
      fetchTodos();
    } else {
      console.log("No user logged in");
    }
  };

  const updateTodo = async (id: string, completed: any) => {
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, { completed: !completed });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    const todoDoc = doc(db, 'todos', id);
    await deleteDoc(todoDoc);
    fetchTodos();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Todo List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="New Task"
            value={task}
            onChangeText={(text) => setTask(text)}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <View style={styles.todoContainer}>
              <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none', flex: 1 }}>{item.task}</Text>
              <TouchableOpacity style={styles.button} onPress={() => updateTodo(item.id, item.completed)}>
                <Text style={styles.buttonText}>{item.completed ? "Undo" : "Complete"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => deleteTodo(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}
*/

export default function ProfileScreen() {
  // TODO: Replace placeholder username and avatar with real user data.
  const username = 'placeholder_username';

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
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.usernameText}>{username}</Text>
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
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0E0E0',
    marginRight: 16,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
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

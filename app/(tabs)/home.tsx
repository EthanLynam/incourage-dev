import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Blank content area */}
      <View style={styles.content} />

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        {/**
         * TODO: Replace placeholder sources with real assets when available.
         * Example: require('@/assets/icons/home.png')
         */}
        <TouchableOpacity style={styles.tabButton}>
          <Image style={styles.icon} source={{ uri: 'placeholder-home' }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Image style={styles.icon} source={{ uri: 'placeholder-search' }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Image style={styles.icon} source={{ uri: 'placeholder-reels' }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Image style={styles.icon} source={{ uri: 'placeholder-shop' }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Image style={styles.icon} source={{ uri: 'placeholder-profile' }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  tabButton: {
    padding: 6,
    borderRadius: 20,
  },
  icon: {
    width: 26,
    height: 26,
    backgroundColor: '#ddd', // placeholder block visual
    borderRadius: 6,
  },
});

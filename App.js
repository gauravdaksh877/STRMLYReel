import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Import navigation
import AppNavigator from './src/navigation/AppNavigator';
// import auth from '@react-native-firebase/auth';

export default function App() {
  // const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
  //     setUser(firebaseUser);
  //     if (initializing) setInitializing(false);
  //   });
  //   return unsubscribe; // Clean up the listener on unmount
  // }, [initializing]);

  // if (initializing) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return <AppNavigator user={user} onLogin={handleLogin} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
});
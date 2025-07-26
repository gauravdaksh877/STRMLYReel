import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Configure Google Sign-In (Moved inside component to ensure latest config)
const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '781830849080-jatv72imvqnrnqdqi3ekcjfi113onk6a.apps.googleusercontent.com',
    offlineAccess: false, // Set to true if you need server-side access
    forceCodeForRefreshToken: true, // [Android] optional
    iosClientId: '781830849080-mrs1qtfgln7o58lrc036io7buj5h907k.apps.googleusercontent.com', // ADD THIS!
  });
};

export default function LoginScreen() {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // 1. Check play services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // 2. Perform sign-in
      const { idToken, user: googleUser } = await GoogleSignin.signIn();
      
      // 3. Create Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // 4. Sign in with credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      const { user } = userCredential;

      // 5. Save/update user in Firestore
      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        provider: 'google',
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastLogin: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

    } catch (error) {
      console.error('Google Sign-In Error:', error);
      let errorMessage = error.message;
      
      // More user-friendly error messages
      if (error.code === '12501') {
        errorMessage = 'Sign in was cancelled';
      } else if (error.code === '10') {
        errorMessage = 'Play Services not available or outdated';
      }
      
      Alert.alert('Sign In Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>VideoFeed</Text>
        <Text style={styles.subtitle}>Join the community</Text>
        
        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={signInWithGoogle}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="login" size={24} color="#fff" />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF0050',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 60,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0050',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
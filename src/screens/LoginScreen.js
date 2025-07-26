import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView
} from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import fontStyles from '../Styles/fontStyles';

const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // Configure Google Sign-In (Moved inside component to ensure latest config)
// const configureGoogleSignIn = () => {
//   GoogleSignin.configure({
//     webClientId: '781830849080-jatv72imvqnrnqdqi3ekcjfi113onk6a.apps.googleusercontent.com',
//     offlineAccess: false, // Set to true if you need server-side access
//     forceCodeForRefreshToken: true, // [Android] optional
//     iosClientId: '781830849080-mrs1qtfgln7o58lrc036io7buj5h907k.apps.googleusercontent.com', // ADD THIS!
//   });
// };

// export default function LoginScreen() {
//   const [loading, setLoading] = React.useState(false);

//   React.useEffect(() => {
//     configureGoogleSignIn();
//   }, []);

//   const signInWithGoogle = async () => {
//     try {
//       setLoading(true);
      
//       // 1. Check play services
//       await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
//       // 2. Perform sign-in
//       const { idToken, user: googleUser } = await GoogleSignin.signIn();
      
//       // 3. Create Firebase credential
//       const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
//       // 4. Sign in with credential
//       const userCredential = await auth().signInWithCredential(googleCredential);
//       const { user } = userCredential;

//       // 5. Save/update user in Firestore
//       await firestore().collection('users').doc(user.uid).set({
//         uid: user.uid,
//         name: user.displayName,
//         email: user.email,
//         photoURL: user.photoURL,
//         provider: 'google',
//         createdAt: firestore.FieldValue.serverTimestamp(),
//         lastLogin: firestore.FieldValue.serverTimestamp(),
//       }, { merge: true });

//     } catch (error) {
//       console.error('Google Sign-In Error:', error);
//       let errorMessage = error.message;
      
//       // More user-friendly error messages
//       if (error.code === '12501') {
//         errorMessage = 'Sign in was cancelled';
//       } else if (error.code === '10') {
//         errorMessage = 'Play Services not available or outdated';
//       }
      
//       Alert.alert('Sign In Error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };
  const handleImagePicker = () => {
    Alert.alert(
      'Select Photo',
      'Choose a profile photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Choose from Gallery', onPress: selectFromGallery }
      ]
    );
  };

  const selectFromGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.error) {
        if (response.error) {
          Alert.alert('Error', 'Failed to select image');
        }
        return;
      }

      if (response.assets && response.assets[0]) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleLogin = () => {
    // Basic validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    
    const userData = {
      uid: Date.now().toString(), 
      displayName: name.trim(),
      name: name.trim(), 
      email: email.trim().toLowerCase(),
      photoURL: profileImage, 
    };

    console.log('User Data:', userData); 
    onLogin(userData);
  };

  const defaultProfileImage = 'https://via.placeholder.com/100x100/FF0050/FFFFFF?text=User';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.title}>Strmly</Text>
              <Text style={styles.subtitle}>Reels</Text>
            </View>
            <Text style={styles.welcomeText}>Welcome! Create your profile to get started</Text>
          </View>
          
         
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.imageContainer} onPress={handleImagePicker}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: profileImage || defaultProfileImage }}
                  style={styles.profileImage}
                />
                <View style={styles.imageOverlay}>
                  <Icon name="camera-alt" size={28} color="#fff" />
                </View>
              </View>
              <Text style={styles.imageText}>
                {profileImage ? 'Tap to change photo' : 'Add your photo'}
              </Text>
              <Text style={styles.imageSubtext}>
                {profileImage ? '' : '(Optional)'}
              </Text>
            </TouchableOpacity>
          </View>
          
          
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Icon name="person-outline" size={24} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Icon name="email" size={24} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
          </View>
          
          
          <View style={styles.actionSection}>
            <TouchableOpacity 
              style={[styles.loginButton, (!name.trim() || !email.trim()) && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={!name.trim() || !email.trim()}
            >
              <Icon name="arrow-forward" size={24} color="#fff" />
              <Text style={styles.buttonText}>Join Strmly Reels</Text>
            </TouchableOpacity>
            
            <Text style={styles.footerText}>
              By joining, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 56,
    ...fontStyles.Montserrat_Bold,
    color: '#FF0050',
    lineHeight: 56,
  },
  subtitle: {
    fontSize: 24,
    ...fontStyles.Montserrat_Light,
    color: '#fff',
    marginTop: -8,
    letterSpacing: 4,
  },
  welcomeText: {
    fontSize: 16,
    ...fontStyles.Montserrat_Regular,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 22,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#222',
    borderWidth: 4,
    borderColor: '#FF0050',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FF0050',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0a0a0a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imageText: {
    color: '#fff',
    fontSize: 16,
    ...fontStyles.Montserrat_Medium,
    textAlign: 'center',
  },
  imageSubtext: {
    color: '#888',
    fontSize: 14,
    ...fontStyles.Montserrat_Regular,
    textAlign: 'center',
    marginTop: 4,
  },
  formSection: {
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
    ...fontStyles.Montserrat_Medium,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    ...fontStyles.Montserrat_Regular,
  },
  actionSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0050',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 30,
    minWidth: 280,
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#FF0050',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#555',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 12,
    ...fontStyles.Montserrat_SemiBold,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    ...fontStyles.Montserrat_Regular,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});

export default LoginScreen;
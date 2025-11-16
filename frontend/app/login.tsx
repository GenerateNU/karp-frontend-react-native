import React, { useState } from 'react';
import { Alert, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Image } from 'expo-image';
import { SignUpFlowButton } from '@/components/signup/SignUpFlowButton';
import { SignUpFlowInput } from '@/components/signup/SignUpFlowInput';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

export default function LoginScreen() {
  const router = useRouter();
  const {
    signIn,
    isLoading,
    isAuthenticated,
    isGuest,
    continueAsGuest,
    fetchUserEntity,
  } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    if (!username || !password) {
      Alert.alert('Missing fields', 'Please enter username and password.');
      return;
    }
    try {
      await signIn({
        username: username.trimEnd(),
        password: password.trimEnd(),
      });
      await fetchUserEntity();
      router.replace('/');
    } catch {}
  }

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    router.replace('/');
  };

  React.useEffect(() => {
    if (isAuthenticated || isGuest) router.replace('/');
  }, [isAuthenticated, isGuest]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.svg')}
            style={styles.logo}
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
        </View>

        <View style={styles.form}>
          <SignUpFlowInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <SignUpFlowInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <SignUpFlowButton
            onPress={handleSubmit}
            text={isLoading ? 'Signing in…' : 'Sign In'}
            style={styles.signUpFlowButton}
            disabled={isLoading}
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleContinueAsGuest}
            style={styles.signUpContainer}
          >
            <Text style={styles.signUpLink}>Continue As Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.light.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.transparent,
    paddingHorizontal: 50,
    paddingTop: 50,
    paddingBottom: 25,
    justifyContent: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: -20,
  },
  logo: {
    width: 225,
    height: 225,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: Colors.light.text,
    fontFamily: Fonts.medium_500,
    alignSelf: 'flex-start',
  },
  form: {
    gap: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpText: {
    fontSize: 14,
    fontFamily: Fonts.light_300,
    color: Colors.light.text,
  },
  signUpLink: {
    fontSize: 14,
    color: Colors.light.fishBlue,
    fontFamily: Fonts.medium_500,
  },
  signUpFlowButton: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -10,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontFamily: Fonts.medium_500,
  },
});

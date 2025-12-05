import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useSignUp } from '@/context/SignUpContext';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SignUpFlowButton } from '@/components/signup/SignUpFlowButton';
import { SignUpFlowInput } from '@/components/signup/SignUpFlowInput';

export default function SignUpScreen() {
  const { data, setData, errors, setError, clearErrors } = useSignUp();
  const router = useRouter();

  const [username, setUsername] = useState(data.username || '');
  const [email, setEmail] = useState(data.email || '');
  const [password, setPassword] = useState(data.password || '');
  const [confirmPassword, setConfirmPassword] = useState(
    data.confirmPassword || ''
  );

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!username) {
      setError('username', 'Please enter a username');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('email', 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setError('email', 'Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setError('password', 'Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setError('password', 'Password must be at least 8 characters long');
      isValid = false;
    }

    if (!confirmPassword) {
      setError('confirmPassword', 'Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setError('confirmPassword', 'Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      setData({ ...data, username, email, password, confirmPassword });
      router.push('/signup/personal');
    }
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <View style={styles.safeAreaView}>
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/sign-up-background.png')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          pointerEvents="none"
        />
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.svg')}
            contentFit="contain"
            style={styles.logo}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Sign Up</Text>
        </View>

        <View style={styles.form}>
          <SignUpFlowInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.username}
          />

          <SignUpFlowInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />

          <SignUpFlowInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            error={errors.password}
          />

          <SignUpFlowInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            secureTextEntry
            error={errors.confirmPassword}
          />

          <SignUpFlowButton
            onPress={handleNext}
            text="Create Account"
            variant="primary"
            style={styles.createAccountButton}
          />

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
    paddingTop: '35%',
    paddingBottom: 25,
    justifyContent: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: -20,
  },
  logo: {
    width: 260,
    height: 160,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    color: Colors.light.primaryText,
    fontFamily: 'Ubuntu',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signInText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  signInLink: {
    fontSize: 14,
    color: Colors.light.fishBlue,
    fontWeight: '500',
  },
  createAccountButton: {
    marginTop: 30,
    width: '100%',
  },
});

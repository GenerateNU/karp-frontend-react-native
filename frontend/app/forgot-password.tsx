import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SignUpFlowInput } from '@/components/signup/SignUpFlowInput';
import { SignUpFlowButton } from '@/components/signup/SignUpFlowButton';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleSend = async () => {
    if (!email) {
      return;
    }
    // TODO: Implement password reset logic
  };

  return (
    <View style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Reset Password</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.instructionText}>
            We will email you{'\n'}a link to reset your password.
          </Text>

          <View style={styles.form}>
            <SignUpFlowInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@gmail.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              containerStyle={styles.inputContainer}
            />

            <SignUpFlowButton
              onPress={handleSend}
              text="Send"
              disabled={!email}
              style={styles.sendButton}
            />
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
    backgroundColor: Colors.light.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: Colors.light.inputBorder,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    color: Colors.light.text,
    fontFamily: Fonts.medium_500,
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: Fonts.medium_500,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sendButton: {
    width: '100%',
  },
});

import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isLoading, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    if (!username || !password) {
      Alert.alert('Missing fields', 'Please enter username and password.');
      return;
    }
    try {
      await signIn({ username, password });
      router.replace('/');
    } catch {
      // error is surfaced in context via Alert; no-op here
    }
  }

  React.useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 16 }}
        >
          <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 8 }}>
            Sign in
          </Text>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, color: '#444' }}>Username</Text>
            <TextInput
              autoCapitalize="none"
              placeholder="your-username"
              value={username}
              onChangeText={setUsername}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 8,
                padding: 12,
              }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, color: '#444' }}>Password</Text>
            <TextInput
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 8,
                padding: 12,
              }}
            />
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#9ca3af' : '#111827',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

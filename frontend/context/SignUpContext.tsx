import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { SignUpData, SignUpContextType } from '@/types/signup';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { volunteerService } from '@/services/volunteerService';
import { userService } from '@/services/userService';
import { UserType } from '@/types/api/user';
import { useLocation } from '@/context/LocationContext';
const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export function SignUpProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [data, setData] = useState<Partial<SignUpData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { userLocation } = useLocation();

  const { signIn, fetchUserEntity } = useAuth();
  const router = useRouter();

  const setDataValue = useCallback((newData: Partial<SignUpData>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const setError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const submitSignUp = useCallback(async () => {
    setIsLoading(true);
    try {
      if (
        !data.username ||
        !data.email ||
        !data.password ||
        !data.firstName ||
        !data.lastName ||
        !data.birthday ||
        !data.preferences
      ) {
        Alert.alert('Missing Information');
        return;
      }

      await userService.createUser({
        username: data.username.trimEnd(),
        email: data.email.trimEnd(),
        password: data.password.trimEnd(),
        firstName: data.firstName.trimEnd(),
        lastName: data.lastName.trimEnd(),
        userType: UserType.VOLUNTEER,
      });

      await signIn({
        username: data.username.trimEnd(),
        password: data.password.trimEnd(),
      });

      if (data.preferences && data.birthday) {
        await volunteerService.createVolunteer({
          firstName: data.firstName,
          lastName: data.lastName,
          preferredName: data.preferredName?.trimEnd(),
          birthDate: data.birthday,
          preferences: data.preferences,
          qualifications: data.qualifications || [],
          preferredDays: data.preferredDays || [],
          location: {
            type: 'Point',
            coordinates: userLocation.coordinates,
          },
        });
        await fetchUserEntity();
      }

      router.replace('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      Alert.alert('Sign Up Failed', message);
    } finally {
      setIsLoading(false);
    }
  }, [data, signIn, router, fetchUserEntity]);

  const resetSignUp = useCallback(() => {
    setData({});
    setErrors({});
    setIsLoading(false);
  }, []);

  const value: SignUpContextType = {
    currentStep,
    data,
    isLoading,
    errors,
    setData: setDataValue,
    setError,
    clearErrors,
    submitSignUp,
    resetSignUp,
    setCurrentStep,
  };

  return (
    <SignUpContext.Provider value={value}>{children}</SignUpContext.Provider>
  );
}

export function useSignUp(): SignUpContextType {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error('useSignUp must be used within SignUpProvider');
  }
  return context;
}

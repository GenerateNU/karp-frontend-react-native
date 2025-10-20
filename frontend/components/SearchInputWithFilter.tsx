import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Fonts } from '@/constants/Fonts';

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  onFilterPress: () => void;
  placeholder?: string;
}

export default function SearchInputWithFilter({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search',
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={onFilterPress}>
        <ThemedText type="subtitle" style={styles.buttonText}>
          Filters &gt;
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    backgroundColor: '#f3f4f6', // gray-100
    paddingHorizontal: 12,
    color: 'black',
  },
  button: {
    marginLeft: 8,
    backgroundColor: 'rgba(12, 120, 128, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: Fonts.medium_500,
  },
});

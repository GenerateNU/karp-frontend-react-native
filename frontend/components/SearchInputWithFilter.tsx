import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';

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
        <Image
          source={require('../assets/images/filters-icon.svg')}
          style={styles.filterIcon}
          contentFit="contain"
        />
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
    borderColor: '#C5C3C3',
    backgroundColor: Colors.light.bottomNav,
    paddingHorizontal: 12,
    color: 'black',
  },
  button: {
    marginLeft: 8,
    backgroundColor: Colors.light.bottomNav,
    borderWidth: 1,
    borderColor: '#C5C3C3',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
});

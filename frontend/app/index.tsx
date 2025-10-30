import { router } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

// Add this button somewhere in your screen
<TouchableOpacity
  onPress={() => router.push('/item/test-id-123')}
  style={{ padding: 20, backgroundColor: '#90D0CD', margin: 20 }}
>
  <Text>TEST: Go to Item Detail</Text>
</TouchableOpacity>;

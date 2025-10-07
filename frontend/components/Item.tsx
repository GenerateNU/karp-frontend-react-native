import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ItemProps {
  name?: string;
  price?: string;
  status?: string;
  timePosted?: string;
  expirationTimestamp?: string;
  id?: string;
}

function Item({
  name = 'Item',
  price = '$0.00',
  status = 'available',
  timePosted = 'Just now',
  expirationTimestamp = 'No expiration',
  id,
}: ItemProps) {
  return (
    <View style={styles.container} testID={id}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.details}>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Price:</Text> {price}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Status:</Text>{' '}
          <Text style={styles.status}>{status}</Text>
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Posted:</Text> {timePosted}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Expires:</Text> {expirationTimestamp}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  status: {
    fontWeight: 'bold',
    color: '#34C759',
  },
});

export default Item;

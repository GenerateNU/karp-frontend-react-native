import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EventProps {
  name?: string;
  location?: string;
  startDateTime?: string;
  endDateTime?: string;
  status?: string;
  maxVolunteers?: string;
  spotsLeft?: string;
  id?: string;
}

function Event({
  name = 'Event',
  location = 'TBD',
  startDateTime = 'TBD',
  endDateTime = 'TBD',
  status = 'upcoming',
  maxVolunteers = 'No limit',
  spotsLeft = 'Unlimited',
  id,
}: EventProps) {
  return (
    <View style={styles.container} testID={id}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.details}>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Location:</Text> {location}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Start:</Text> {startDateTime}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>End:</Text> {endDateTime}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Status:</Text>{' '}
          <Text style={styles.status}>{status}</Text>
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Max Volunteers:</Text> {maxVolunteers}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Spots Left:</Text>{' '}
          <Text style={styles.spotsLeft}>{spotsLeft}</Text>
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
    color: '#007AFF',
  },
  spotsLeft: {
    fontWeight: 'bold',
    color: '#34C759',
  },
});

export default Event;

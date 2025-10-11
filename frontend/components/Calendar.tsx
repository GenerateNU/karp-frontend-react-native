import {
  Calendar as ReactNativeCalendar,
  DateData,
} from 'react-native-calendars';
import { StyleSheet } from 'react-native';
import { MarkedDates } from 'react-native-calendars/src/types';

export function Calendar({
  onDayPress,
  markedDates,
}: {
  onDayPress: (day: DateData) => void;
  markedDates?: MarkedDates;
}) {
  return (
    <ReactNativeCalendar
      onDayPress={onDayPress}
      markedDates={markedDates}
      style={styles.calendar}
    />
  );
}

const styles = StyleSheet.create({
  calendar: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
});

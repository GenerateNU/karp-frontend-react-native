import { View, Text, StyleSheet } from 'react-native';
import { ItemInfo } from '@/types/api/item';

export default function ItemInfoTable({
  name,
  vendor,
  address,
  description,
  price,
}: ItemInfo) {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.detail}>
          <View style={styles.detail}>
            <View style={styles.container}>
              <View style={styles.container}>
                <Text style={styles.title}>{name}</Text>
              </View>
            </View>
            <Text style={{}}>{vendor}</Text>
          </View>
          <Text style={styles.subtitle}>{address}</Text>
          <Text style={styles.detailText}>{description}</Text>
        </View>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{price}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 100,
    display: 'flex',
  },
  title: {
    width: 367,
    color: 'black',
    fontSize: 44,
    fontFamily: 'Josefin Sans',
    fontWeight: '400',
    wordWrap: 'break-word',
  },
  subtitle: {
    alignSelf: 'stretch',
    // flex: '1 1 0',
    color: 'black',
    fontSize: 32,
    fontFamily: 'Josefin Sans',
    fontWeight: '300',
    paddingBottom: 12,
    wordWrap: 'break-word',
  },
  detail: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    display: 'flex',
  },
  detailText: {
    width: 339,
    color: 'black',
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    fontWeight: '300',
    paddingBottom: 12,
    wordWrap: 'break-word',
  },
  button: {
    width: 163.33,
    height: 49,
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: '#90D0CD',
    borderRadius: 16.33,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    display: 'flex',
  },
  buttonText: {
    color: 'black',
    fontSize: 22,
    fontFamily: 'Josefin Sans',
    fontWeight: '400',
    wordWrap: 'break-word',
  },
});

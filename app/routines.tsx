import { View, Text, StyleSheet } from 'react-native';

export default function Routines() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Routines</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E8D8',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  text: {
    fontSize: 24,
    color: '#2C2C2C',
  },
});

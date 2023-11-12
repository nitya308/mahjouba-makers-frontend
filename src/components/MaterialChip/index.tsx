import { Text, View } from 'native-base';
import { StyleSheet } from 'react-native';
import Colors from 'utils/Colors';
import { fonts } from 'utils/constants';

const MaterialChip = ({ materialName }: { materialName: string }) => {
  return (
    <View key={materialName} style={styles.materialChip}>
      <Text fontFamily={fonts.regular}>{materialName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  materialChip: {
    backgroundColor: '#D1963A',
    borderRadius: 2,
    padding: 5,
    borderColor: '#000000',
    borderWidth: 1,
  },
});

export default MaterialChip;
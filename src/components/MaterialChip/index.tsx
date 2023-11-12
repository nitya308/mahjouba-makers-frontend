import { Text, View } from 'native-base';
import { StyleSheet } from 'react-native';
import Colors from 'utils/Colors';
import { fonts } from 'utils/constants';

const MaterialChip = ({ materialName }: { materialName: string }) => {
  return (
    <View key={materialName} style={styles.materialChip}>
      <Text fontFamily={fonts.semiBold}>{materialName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  materialChip: {
    backgroundColor: Colors.lightBrown,
    borderRadius: 2,
    padding: 5,
    borderColor: '#000000',
    borderWidth: 1,
  },
});

export default MaterialChip;
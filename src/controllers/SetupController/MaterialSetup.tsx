import React, { useState } from 'react';
import { Box, Text } from 'native-base';
import MaterialSelector from 'components/MaterialSelector';
import { StyleSheet } from 'react-native';
import SharpButton from 'components/SharpButton';

export default function MaterialSetup({ navigation }): JSX.Element {
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  return <Box minH='200px' mt='150'>
    <Text fontSize='30' color='white' textAlign='center'>
      What materials do {'\n'} you work with?
    </Text>
    <MaterialSelector
      selectedMaterialIds={selectedMaterialIds}
      setSelectedMaterialIds={setSelectedMaterialIds}
    />
    <SharpButton
      style={[styles.leftButton]}
      onPress={() => navigation.navigate('ICESetup')}>
      <Text color='white' fontWeight='medium' fontSize='50px' textAlign='center' lineHeight={40}>⟵</Text>

    </SharpButton>

    <SharpButton
      style={[styles.rightButton]}
      onPress={() => navigation.navigate('AddressSetup')}>
      <Text color='white' fontWeight='medium' fontSize='50px' textAlign='center' lineHeight={40}>⟶</Text>
    </SharpButton>
  </Box>;
}


const styles = StyleSheet.create({
  leftButton: {
    marginLeft: 20,
    width: 74,
    position: 'absolute',
    bottom: -420,
    left: 0,
    transform: [{ translateY: 0 }],
  },
  rightButton: {
    marginRight: 20,
    width: 74,
    position: 'absolute',
    bottom: -420,
    right: 0,
    transform: [{ translateY: 0 }],
  },
  italic: { fontStyle: 'italic' },
  underline: { textDecorationLine: 'underline' },
});
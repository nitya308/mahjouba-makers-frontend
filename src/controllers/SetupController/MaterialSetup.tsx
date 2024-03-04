import React, { useState } from 'react';
import { Box, HStack, Icon, Text, View } from 'native-base';
import MaterialSelector from 'components/MaterialSelector';
import { Alert } from 'react-native';
import SharpButton from 'components/SharpButton';
import DotProgress from 'components/DotProgress';
import { AntDesign } from '@expo/vector-icons';

export default function MaterialSetup({ navigation }): JSX.Element {
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  return (
    <View flex='1'>
      <Box minH='200px' mt='150'>
        <Text fontSize='30' color='white' textAlign='center'>
          What materials do {'\n'} you work with?
        </Text>
        <MaterialSelector
          selectedMaterialIds={selectedMaterialIds}
          setSelectedMaterialIds={setSelectedMaterialIds}
        />
      </Box>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, marginBottom: 50 }}>
        <HStack space={4} justifyContent='space-around' alignItems='center'>
          <SharpButton
            leftIcon={<Icon as={AntDesign} name='arrowleft' color='white' size='lg' />}
            ml='30px'
            p='10px'
            onPress={navigation.goBack}
          />
          <DotProgress progress={5} completion={7} />
          <SharpButton
            leftIcon={<Icon as={AntDesign} name='arrowright' color='white' size='lg' />}
            p='10px'
            mr='30px'
            onPress={() => (selectedMaterialIds ? navigation.navigate('AddressSetup') : Alert.alert('Please complete all fields'))}
          />
        </HStack>
      </View>
    </View>
  );
}

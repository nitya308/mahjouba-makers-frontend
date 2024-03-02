import SharpButton from 'components/SharpButton';
import { Center, Heading, Input, VStack, HStack, Box, Text, Icon } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import CameraButton from 'components/CameraButton';
import { Asset } from 'react-native-image-picker';
import { StyleSheet } from 'react-native';
import { Alert } from 'react-native';
import Colors from 'utils/Colors';

export default function IDSetup({ navigation }): JSX.Element {

  const [idNo, setIdNo] = useState<string | undefined>();
  const [idPicFront, setIdPicFront] = useState<Asset | undefined>();
  const [idPicBack, setIdPicBack] = useState<Asset | undefined>();

  return <Center>
    <VStack space={2} mt={200}>
      <Heading fontSize='30' mx='auto' color='white'>
        Enter your ID
      </Heading>
      <Heading fontSize='24' mx='auto' color='white' mt={10} style={styles.underline}>
        ID Number
      </Heading>
      <Input
        w='195px'
        borderRadius='2px'
        paddingY='10px'
        paddingX='16px'
        placeholder='Number'
        autoCapitalize='none'
        color='white'
        borderColor={Colors.outline}
        borderWidth='1px'
        size='sm'
        value={idNo}
        onChangeText={setIdNo}
      />
      <Center my='20px'>
        <Heading fontSize='24' mx='auto' color='white' style={styles.underline}>
          ID Photo
        </Heading>
        <HStack space='6'>
          <Box>
            <Text my='5px' fontSize='20' color='white'>Front:</Text>
            <CameraButton
              selectedImageAsset={idPicFront}
              setSelectedImageAsset={setIdPicFront}
            />
          </Box>
          <Box>
            <Text my='5px' fontSize='20' color='white'>Back:</Text>
            <CameraButton
              selectedImageAsset={idPicBack}
              setSelectedImageAsset={setIdPicBack}
            />
          </Box>
        </HStack>
      </Center>
    </VStack>
    <SharpButton
      style={[styles.leftButton]}
      onPress={() => navigation.navigate('IDSetup')}>
      <Text color='white' fontWeight='medium' fontSize='50px' textAlign='center' lineHeight={40}>⟵</Text>

    </SharpButton>

    <SharpButton
      style={[styles.rightButton]}
      onPress={() => idPicFront && idPicBack && idNo ? navigation.navigate('ICESetup') : Alert.alert('Please select ID images and enter your ID number.')}>
      <Text color='white' fontWeight='medium' fontSize='50px' textAlign='center' lineHeight={40}>⟶</Text>
    </SharpButton>
  </Center>;
}




const styles = StyleSheet.create({
  leftButton: {
    marginLeft: 20,
    width: 74,
    position: 'absolute',
    bottom: -240,
    left: 0,
    transform: [{ translateY: 0 }],
  },
  rightButton: {
    marginRight: 20,
    width: 74,
    position: 'absolute',
    bottom: -240,
    right: 0,
    transform: [{ translateY: 0 }],
  },
  italic: { fontStyle: 'italic' },
  underline: { textDecorationLine: 'underline' },
});
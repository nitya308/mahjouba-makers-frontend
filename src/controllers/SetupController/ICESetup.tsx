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

  const [iceNo, setIceNo] = useState<string | undefined>();
  const [icePicFront, setIcePicFront] = useState<Asset | undefined>();
  const [icePicBack, setIcePicBack] = useState<Asset | undefined>();

  return <Center>
    <VStack space={2} mt={200}>
      <Heading fontSize='30' mx='auto' color='white'>
                Enter your ICE Info
      </Heading>
      <Heading fontSize='24' mx='auto' color='white' mt={10} style={styles.underline}>
        ICE Number
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
        value={iceNo}
        onChangeText={setIceNo}
      />
      <Center my='20px'>
        <Heading fontSize='24' mx='auto' color='white' style={styles.underline}>
            ICE Photo
        </Heading>
        <HStack space='6'>
          <Box>
            <Text my='5px' fontSize='20' color='white'>Front:</Text>
            <CameraButton
              selectedImageAsset={icePicFront}
              setSelectedImageAsset={setIcePicFront}
            />
          </Box>
          <Box>
            <Text my='5px' fontSize='20' color='white'>Back:</Text>
            <CameraButton
              selectedImageAsset={icePicBack}
              setSelectedImageAsset={setIcePicBack}
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
      onPress={() => icePicFront && icePicBack && iceNo ? navigation.navigate('MaterialSetup') : Alert.alert('Please select ICE images and enter your ICE number.')}>
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
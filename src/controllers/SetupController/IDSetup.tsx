import SharpButton from 'components/SharpButton';
import { Center, Heading, Input, VStack, HStack, Box, Text, Icon } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import CameraButton from 'components/CameraButton';
import { Asset } from 'react-native-image-picker';

export default function IDSetup({
  idNo,
  setIdNo,
  idPhotoFront,
  setIdPhotoFront,
  idPhotoBack,
  setIdPhotoBack,
}: {
  idNo?: string,
  setIdNo: (newVal?: string) => void;
  idPhotoFront?: Asset;
  setIdPhotoFront: (newAsset?: Asset) => void;
  idPhotoBack?: Asset;
  setIdPhotoBack: (newAsset?: Asset) => void;
}): JSX.Element {
  return <Center>
    <VStack space={2}>
      <Input
        w='100%' 
        borderRadius='2px'  
        paddingY='10px' 
        paddingX='16px'
        placeholder='Number' 
        autoCapitalize='none'
        borderColor='black'
        borderWidth='1px'
        size='sm'
        value={idNo} 
        onChangeText={setIdNo} 
      />
      <Center my='20px'>
        <Heading fontSize='lg' mx='auto'>
            ICE Photo
        </Heading>
        <HStack space='6'>
          <Box>
            <Text my='5px'>Front:</Text>
            <CameraButton
              selectedImageAsset={idPhotoFront}
              setSelectedImageAsset={setIdPhotoFront}
            />
          </Box>
          <Box>
            <Text my='5px'>Back:</Text>
            <CameraButton
              selectedImageAsset={idPhotoBack}
              setSelectedImageAsset={setIdPhotoBack}
            />
          </Box>
        </HStack>
      </Center>
    </VStack>
  </Center>;
}

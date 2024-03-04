import SharpButton from 'components/SharpButton';
import { Center, Heading, Input, VStack, HStack, Box, Text, Icon, View } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import CameraButton from 'components/CameraButton';
import { Asset } from 'react-native-image-picker';
import { StyleSheet } from 'react-native';
import { Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from 'utils/Colors';
import DotProgress from 'components/DotProgress';
import { useTranslation } from 'react-i18next';

export default function IDSetup({ navigation, route }): JSX.Element {
  const { name, selectedImage } = route.params;
  const [idNo, setIdNo] = useState<string | undefined>();
  const [idPicFront, setIdPicFront] = useState<Asset | undefined>();
  const [idPicBack, setIdPicBack] = useState<Asset | undefined>();
  const { t } = useTranslation();

  return (
    <View flex={1}>
      <Center flex={1} >
        <VStack space={2}>
          <Heading fontSize='30' color='white' textAlign='center'>
            {t('Enter your ID')}
          </Heading>
          <Heading fontSize='24' color='white' mt='40px' textDecorationLine='underline' textAlign='center'>
            {t('ID Number')}
          </Heading>
          <Input
            w='195px'
            borderRadius='2px'
            paddingY='10px'
            paddingX='16px'
            placeholder='Number'
            autoCapitalize='none'
            color='white'
            backgroundColor={Colors.highlight}
            borderColor={Colors.outline}
            borderWidth='1px'
            size='sm'
            value={idNo}
            onChangeText={setIdNo}
          />
          <Center my='20px'>
            <Heading fontSize='24' color='white' textDecorationLine='underline'>
              {t('ID Photo')}
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
      </Center>
      <HStack mb='50px' space={4} justifyContent='space-around' alignItems='center'>
        <SharpButton
          leftIcon={<Icon as={AntDesign} name='arrowleft' color='white' size='lg' />}
          ml='30px'
          p='10px'
          onPress={navigation.goBack}
        />
        <DotProgress progress={2} completion={7} />
        <SharpButton
          backgroundColor={Colors.highlight}
          leftIcon={<Icon as={AntDesign} name='arrowright' color='white' size='lg' />}
          mr='30px'
          p='10px'
          onPress={() => (idNo && idPicBack && idPicFront ? navigation.navigate('ICESetup', { name, selectedImage, idNo, idPicBack, idPicFront }) : alert('Please complete all fields'))}
        />
      </HStack>
    </View>
  );
}


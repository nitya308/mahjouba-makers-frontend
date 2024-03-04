import SharpButton from 'components/SharpButton';
import { Center, Heading, Input, VStack, HStack, Box, Text, Icon, View } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import CameraButton from 'components/CameraButton';
import { Asset } from 'react-native-image-picker';
import { StyleSheet } from 'react-native';
import { Alert } from 'react-native';
import Colors from 'utils/Colors';
import { AntDesign } from '@expo/vector-icons';
import DotProgress from 'components/DotProgress';

export default function IDSetup({ navigation, route }): JSX.Element {
  const { name, selectedImage, idNo, idPicBack, idPicFront } = route.params;
  const [iceNo, setIceNo] = useState<string | undefined>();
  const [icePicFront, setIcePicFront] = useState<Asset | undefined>();
  const [icePicBack, setIcePicBack] = useState<Asset | undefined>();



  return (
    <View style={{ flex: 1 }}>
      <VStack flex={1} justifyContent="center" alignItems="center">
        <VStack space={2} alignItems="center">
          <Heading fontSize='30' color='white' textAlign='center'>
            Enter your ICE Info
          </Heading>
          <Heading fontSize='24' color='white' mt='40px' style={styles.underline} textAlign='center'>
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
            <Heading fontSize='24' color='white' style={styles.underline}>
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
      </VStack>
      <View mb='50'>
        <HStack space={4} justifyContent='space-around' alignItems='center'>
          <SharpButton
            leftIcon={<Icon as={AntDesign} name='arrowleft' color='white' size='lg' />}
            ml='30px'
            p='10px'
            onPress={navigation.goBack}
          />
          <DotProgress progress={3} completion={7} />
          <SharpButton
            backgroundColor={'rgba(255, 192, 29, 0.2)'}
            leftIcon={<Icon as={AntDesign} name='arrowright' color='white' size='lg' />}
            p='10px'
            mr='30px'
            onPress={() => (iceNo && icePicBack && icePicFront ? navigation.navigate('BankingSetup', 
              { name, selectedImage, idNo, idPicBack, idPicFront, iceNo, icePicBack, icePicFront }) : Alert.alert('Please complete all fields'))}
          />
        </HStack>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  italic: { fontStyle: 'italic' },
  underline: { textDecorationLine: 'underline' },
});
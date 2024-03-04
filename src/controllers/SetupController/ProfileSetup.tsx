import React, { useState, useEffect } from 'react';
import { Image } from 'react-native-image-crop-picker';
import { Box, Text, Input, HStack, Spacer, Icon, View, VStack } from 'native-base';
import ProfileImageSelector from 'components/ProfileImageSelector';
import useAppSelector from 'hooks/useAppSelector';
import { authSelector, setName } from 'redux/slices/authSlice';
import useAppDispatch from 'hooks/useAppDispatch';
import Colors from 'utils/Colors';
import SharpButton from 'components/SharpButton';
import { StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Alert } from 'react-native';
import DotProgress from 'components/DotProgress';


export default function ProfileSetup({ navigation }): JSX.Element {
  const [selectedImage, setSelectedImage] = useState<Image | undefined>();
  const dispatch = useAppDispatch();
  const { name } = useAppSelector(authSelector);
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    if (!name || name.length < 1) {
      setShowNameInput(true);
    } else {
      setShowNameInput(false);
    }
  }, []);

  return (
    <View flex='1'>
      <View flex='1' mt='200px'>
        <ProfileImageSelector
          width={150}
          height={150}
          selectedProfile={selectedImage}
          setSelectedProfile={setSelectedImage}
        />
        {showNameInput && (
          <View style={{ alignItems: 'center' }}>
            <Text fontSize='md'>Name</Text>
            <Input
              w='190px'
              borderRadius='2px'
              paddingY='10px'
              paddingX='16px'
              borderColor={Colors.outline}
              borderWidth='1px'
              placeholder='Name'
              autoCapitalize='none'
              color='white'
              size='sm'
              type='text'
              value={name}
              onChangeText={(newText: string) => dispatch(setName(newText))}
            />
          </View>
        )}
      </View>
      <View >
        <HStack mb='50px' space={4} justifyContent='space-around' alignItems='center'>
          <SharpButton
            leftIcon={<Icon as={AntDesign} name='arrowleft' color='white' size='lg' />}
            ml='30px'
            p='10px'
            onPress={navigation.goBack}
          />
          <DotProgress progress={0} completion={7} />
          <SharpButton
            leftIcon={<Icon as={AntDesign} name='arrowright' color='white' size='lg' />}
            mr='30px'
            p='10px'
            onPress={() => (name && selectedImage ? navigation.navigate('DataAgreement') : alert('Please complete all fields'))}
          />
        </HStack>
      </View>
    </View>
  );
}
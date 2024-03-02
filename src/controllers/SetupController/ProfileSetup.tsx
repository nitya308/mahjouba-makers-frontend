import React, { useState, useEffect } from 'react';
import { Image } from 'react-native-image-crop-picker';
import { Box, Text, Input } from 'native-base';
import ProfileImageSelector from 'components/ProfileImageSelector';
import useAppSelector from 'hooks/useAppSelector';
import { authSelector, setName } from 'redux/slices/authSlice';
import useAppDispatch from 'hooks/useAppDispatch';
import Colors from 'utils/Colors';
import SharpButton from 'components/SharpButton';
import { StyleSheet } from 'react-native';
import { Alert } from 'react-native';


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

  return <Box mt='200px'>
    <ProfileImageSelector
      width={150}
      height={150}
      selectedProfile={selectedImage}
      setSelectedProfile={setSelectedImage}
    />
    {
      showNameInput &&
      <Box alignItems='center'>
        <Text fontSize='md' mx='auto' >
          Name
        </Text>
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
      </Box>
    }
    {/* <SharpButton
      style={[styles.leftButton]}
      onPress={() => navigation.navigate('Signup')}>
      <Text color='white' fontWeight='medium' fontSize='50px' textAlign='center' lineHeight={40}>⟵</Text>

    </SharpButton> */}

    <SharpButton
      style={[styles.rightButton]}
      onPress={() => selectedImage && name ? navigation.navigate('IDSetup') : Alert.alert('Please select an image and enter your name.') }>
      <Text color='white' fontWeight='medium' fontSize='50px' textAlign='center' lineHeight={40}>⟶</Text>
    </SharpButton>

  </Box>;

}

const styles = StyleSheet.create({
  leftButton: {
    marginLeft: 20,
    width: 74,
    position: 'absolute',
    bottom: -400,
    left: 0,
    transform: [{ translateY: 0 }],
  },
  rightButton: {
    marginRight: 20,
    width: 74,
    position: 'absolute',
    bottom: -400,
    right: 0,
    transform: [{ translateY: 0 }],
  },
});
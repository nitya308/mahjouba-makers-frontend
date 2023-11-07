import React, { useState, useEffect } from 'react';
import { Image } from 'react-native-image-crop-picker';
import { Box, Text, Input } from 'native-base';
import ProfileImageSelector from 'components/ProfileImageSelector';
import useAppSelector from 'hooks/useAppSelector';
import { authSelector, setName } from 'redux/slices/authSlice';
import useAppDispatch from 'hooks/useAppDispatch';

export default function ProfileSetup({
  selectedImage,
  setSelectedImage,
}: {
  selectedImage?: Image;
  setSelectedImage: (newImage?: Image) => void;
}): JSX.Element {
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

  return <Box>
    <ProfileImageSelector
      width={150}
      height={150}
      selectedProfile={selectedImage}
      setSelectedProfile={setSelectedImage}
    />
    {
      showNameInput &&
      <Box>
        <Text fontSize='md' mx='auto'>
          Name
        </Text>
        <Input 
          w='100%' 
          borderRadius='2px'  
          paddingY='10px' 
          paddingX='16px'
          borderColor='black'
          borderWidth='1px'
          placeholder='Name' 
          autoCapitalize='none'
          size='sm'
          type='text'
          value={name} 
          onChangeText={(newText: string) => dispatch(setName(newText))} 
        />
      </Box>
    }
  </Box>;
}
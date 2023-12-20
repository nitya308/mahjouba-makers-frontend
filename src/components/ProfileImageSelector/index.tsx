import React, { useMemo } from 'react';
import { Image } from 'react-native-image-crop-picker';
// import FastImage from 'react-native-fast-image';
import { Image as ExpoImage } from 'expo-image';
import { View, Button, Center } from 'native-base';
import ProfileImage from '../../assets/profileDefault.png';
import { DEFAULT_PROFILE_URI } from 'utils/constants';
import useAppSelector from 'hooks/useAppSelector';
import { userDataSelector } from 'redux/slices/userDataSlice';

export default function ProfileImageSelector({
  selectedProfile,
  setSelectedProfile,
  defaultImageUri,
  width,
  height,
}: {
  selectedProfile?: Image;
  setSelectedProfile: (newProfile: Image | undefined) => void;
  defaultImageUri?: string;
  width: number;
  height: number;
}): JSX.Element {
  const selectImage = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const ImagePicker = require('react-native-image-crop-picker');
      const selection = await ImagePicker.openPicker({
        width: 200,
        height: 200,
        cropping: true,
        cropperCircleOverlay: true,
      });
      if (selection) {
        setSelectedProfile(selection);
      }
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const selectedUri = useMemo(() => {
    if (selectedProfile) {
      return selectedProfile.sourceURL || `file://${selectedProfile.path}`;
    } else if (defaultImageUri) {
      return defaultImageUri;
    }
    return DEFAULT_PROFILE_URI;
  }, [selectedProfile]);

  return <Center>
    <ExpoImage
      source={{
        uri: selectedUri,
        // priority: 'normal',
      }}
      style={{
        width,
        height,
        borderRadius: width,
        marginHorizontal: 'auto',
      }}
    />
    <Button
      mt={`-${height / 2}px`}
      borderRadius='full'
      size='xs'
      colorScheme='dark'
      variant='subtle'
      opacity={0.8}
      onPress={selectImage}
      mb={`${height / 2}px`}
      mx='auto'
    >
      Select profile image
    </Button>
  </Center>;
}
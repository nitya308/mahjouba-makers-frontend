import React, { useMemo } from 'react';
import { Image } from 'react-native-image-crop-picker';
// import FastImage from 'react-native-fast-image';
import { Image as ExpoImage } from 'expo-image';
import { View, Button } from 'native-base';
import ProfileImage from '../../assets/profileDefault.png';

const DEFAULT_PROFILE_URI = ProfileImage;

export default function ProfileImageSelector({
  selectedProfile,
  setSelectedProfile,
  width,
  height,
}: {
  selectedProfile?: Image;
  setSelectedProfile: (newProfile: Image | undefined) => void;
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
    }
    return DEFAULT_PROFILE_URI.uri;
  }, [selectedProfile]);

  return <View>
    <ExpoImage
      source={{
        uri: selectedUri,
        // priority: 'normal',
      }}
      style={{
        width,
        height,
        borderRadius: width,
      }}
    />
    <Button
      mt={`-${height / 2}px`}
      borderRadius='full'
      size='sm'
      colorScheme='dark'
      variant='subtle'
      opacity={0.8}
      onPress={selectImage}
      mb={`${height / 2}px`}
    >
      Select profile image
    </Button>
  </View>;
}
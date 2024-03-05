import React, { useCallback } from 'react';
import { launchCamera, Asset, launchImageLibrary } from 'react-native-image-picker';
import { Image as ExpoImage } from 'expo-image';
import { Box, Icon, Text } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SharpButton from 'components/SharpButton';
import { TouchableOpacity } from 'react-native';
import Colors from 'utils/Colors';
import { useTranslation } from 'react-i18next';

export default function CameraButton({
  selectedImageAsset,
  setSelectedImageAsset,
}: {
  selectedImageAsset?: Asset,
  setSelectedImageAsset: (newAsset?: Asset) => void;
}): JSX.Element {
  const { t } = useTranslation();
  const handleCameraSelect = useCallback(async () => {
    try {
      const cameraRes = await launchCamera({
        saveToPhotos: false,
        mediaType: 'photo',
      });
      if (cameraRes.assets && cameraRes.assets.length > 0) {
        setSelectedImageAsset(cameraRes.assets[0]);
      } else {
        const libraryRes = await launchImageLibrary({
          selectionLimit: 1,
          mediaType: 'photo',
        });
        if (libraryRes.assets && libraryRes.assets.length > 0) {
          console.log(libraryRes.assets[0]);
          setSelectedImageAsset(libraryRes.assets[0]);
        }
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }, [selectedImageAsset, setSelectedImageAsset]);

  return (
    selectedImageAsset?.uri ?
      <Box borderColor={Colors.outline}>
        <ExpoImage
          source={{
            uri: selectedImageAsset.uri,
          }}
          style={{
            width: 100,
            height: 100,
            borderColor: 'green',
            borderWidth: 5,
            borderRadius: 5,
          }}
        />
        <TouchableOpacity onPress={handleCameraSelect}>
          <Text fontSize='xs' textDecorationLine='underline' fontWeight='bold' ml='auto' color='white'>{t('Retake')}</Text>
        </TouchableOpacity>
      </Box> :
      <Box>
        <SharpButton leftIcon={<Icon as={MaterialCommunityIcons} name='camera-outline' size='xl' color='white'  />} 
          bgColor={Colors.highlight} py='20px' px='30px' onPress={handleCameraSelect}></SharpButton>
      </Box>
  );
}

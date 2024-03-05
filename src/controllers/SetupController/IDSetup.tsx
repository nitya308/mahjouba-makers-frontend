import SharpButton from 'components/SharpButton';
import { Center, Heading, Input, VStack, HStack, Box, Text, Icon, View, IconButton } from 'native-base';
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
import styles from 'styles/onboarding';
import TextHighlighter from 'components/SpeechHighlighter';
import AudioIcon from '../../assets/audio_icon.svg';

export default function IDSetup({ navigation, route }): JSX.Element {
  const { name, selectedImage } = route.params;
  const [idNo, setIdNo] = useState<string | undefined>();
  const [idPicFront, setIdPicFront] = useState<Asset | undefined>();
  const [idPicBack, setIdPicBack] = useState<Asset | undefined>();
  const { t } = useTranslation();
  const [pressed, setPressed] = useState(false);

  return (
    <View flex={1}>
      <IconButton
        style={styles.audioStyle}
        icon={<AudioIcon />}
        onPress={() => {
          setPressed(true);
        }}
      />
      <Center flex={1} >
        <VStack space={2}>
          <TextHighlighter style={styles.heading} text={t('Enter your ID')} pressed={pressed} setPressed={setPressed} />
          <TextHighlighter style={styles.subheading} text={t('ID Number')} pressed={pressed} setPressed={setPressed} />
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
            <TextHighlighter style={styles.subheading} text={t('ID Photo')} pressed={pressed} setPressed={setPressed} />
            <HStack space='6'>
              <Box>
                <TextHighlighter style={styles.small} text={t('Front:')} pressed={pressed} setPressed={setPressed} />
                <CameraButton
                  selectedImageAsset={idPicFront}
                  setSelectedImageAsset={setIdPicFront}
                />
              </Box>
              <Box>
                <TextHighlighter style={styles.small} text={t('Back:')} pressed={pressed} setPressed={setPressed} />
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


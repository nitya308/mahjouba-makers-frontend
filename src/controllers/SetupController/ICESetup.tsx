import SharpButton from 'components/SharpButton';
import { Center, Heading, Input, VStack, HStack, Box, Text, Icon, View, IconButton } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import CameraButton from 'components/CameraButton';
import { Asset } from 'react-native-image-picker';
import Colors from 'utils/Colors';
import { AntDesign } from '@expo/vector-icons';
import DotProgress from 'components/DotProgress';
import { useTranslation } from 'react-i18next';
import TextHighlighter from 'components/SpeechHighlighter';
import styles from 'styles/onboarding';
import AudioIcon from '../../assets/audio_icon.svg';
import * as Speech from 'expo-speech';
import StopIcon from '../../assets/hand_icon.svg';

export default function IDSetup({ navigation, route }): JSX.Element {
  const { name, selectedImage, idNo, idPicBack, idPicFront } = route.params;
  const [iceNo, setIceNo] = useState<string | undefined>();
  const [icePicFront, setIcePicFront] = useState<Asset | undefined>();
  const [icePicBack, setIcePicBack] = useState<Asset | undefined>();
  const { t } = useTranslation();
  const [pressed, setPressed] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <IconButton
        style={styles.audioStyle}
        icon={!pressed ? <AudioIcon /> : <StopIcon/>}
        onPress={() => {
          if (pressed) {
            Speech.stop();
            setPressed(false);
          } else {
            setPressed(true);
          }
        }}
      />
      <VStack flex={1} justifyContent="center" alignItems="center">
        <VStack space={2} alignItems="center">
          <TextHighlighter style={styles.heading} text={t('Enter your ICE Info')} pressed={pressed} setPressed={setPressed} />
          <TextHighlighter style={styles.subheading} text={t('ICE Number')} pressed={pressed} setPressed={setPressed} />
          <Input
            w='195px'
            borderRadius='2px'
            paddingY='10px'
            paddingX='16px'
            backgroundColor={Colors.highlight}
            placeholder={t('Number')}
            autoCapitalize='none'
            color='white'
            borderColor={Colors.outline}
            borderWidth='1px'
            size='sm'
            value={iceNo}
            onChangeText={setIceNo}
          />
          <Center my='20px'>
            <TextHighlighter style={styles.subheading} text={t('ICE Photo')} pressed={pressed} setPressed={setPressed} />
            <HStack space='6'>
              <Box>
                <TextHighlighter style={styles.small} text={t('Front:')} pressed={pressed} setPressed={setPressed} />
                <CameraButton
                  selectedImageAsset={icePicFront}
                  setSelectedImageAsset={setIcePicFront}
                />
              </Box>
              <Box>
                <TextHighlighter style={styles.subheading} text={t('Back:')} pressed={pressed} setPressed={setPressed} />
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
            backgroundColor={Colors.highlight}
            leftIcon={<Icon as={AntDesign} name='arrowright' color='white' size='lg' />}
            p='10px'
            mr='30px'
            onPress={() => (iceNo && icePicBack && icePicFront ? navigation.navigate('BankingSetup',
              { name, selectedImage, idNo, idPicBack, idPicFront, iceNo, icePicBack, icePicFront }) : alert('Please complete all fields'))}
          />
        </HStack>
      </View>
    </View>
  );
}

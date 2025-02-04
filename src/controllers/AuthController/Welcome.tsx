import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box, ScrollView, IconButton } from 'native-base';
import SharpButton from 'components/SharpButton';
import i18next from 'i18next';
import { Languages } from 'types/user';
import { SafeAreaView } from 'react-native';
import MahjoubaLogo from '../../assets/mahjouba_logo.svg';
import * as Speech from 'expo-speech';
import AudioIcon from '../../assets/audio_icon.svg';
import StopIcon from '../../assets/hand_icon.svg';
import TextHighlighter from '../../components/SpeechHighlighter';
import styles from 'styles/onboarding';
import AppStyles from 'styles/commonstyles';

export default function Welcome({ navigation }: { navigation: any }) {

  const [pressed, setPressed] = useState(false);

  const handleLanguageSelection = (language: Languages) => {
    i18next.changeLanguage(language);
    navigation.navigate('Authenticate');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Center flex={1}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <VStack space={2} alignItems="center">
            <MahjoubaLogo width='141px' height='104.88px' />
            <Box height='65px' width='100%' />
            <SharpButton width='188px' my='10px'
              size='sm' onPress={() => handleLanguageSelection(Languages.EN)}>
              <TextHighlighter style={AppStyles.buttonText} text={'Welcome'} pressed={pressed} setPressed={setPressed} />
            </SharpButton>
            <SharpButton width='188px' my='10px'
              size='sm' onPress={() => handleLanguageSelection(Languages.FR)}>
              <TextHighlighter style={AppStyles.buttonText} text={'Bienvenue'} pressed={pressed} setPressed={setPressed} />
            </SharpButton>
            <SharpButton width='188px' my='10px'
              size='sm' onPress={() => handleLanguageSelection(Languages.AR)}>
              <TextHighlighter style={AppStyles.buttonText} text={'مرحباً'} pressed={pressed} setPressed={setPressed} />
            </SharpButton>
          </VStack>
        </ScrollView>
      </Center>
      <IconButton
        icon={!pressed ? <AudioIcon /> : <StopIcon/>}
        onPress={() => {
          if (pressed) {
            Speech.stop();
            setPressed(false);
          } else {
            setPressed(true);
          }
        }}
        style={AppStyles.audioButtonStyle}
      />
    </SafeAreaView>
  );
}
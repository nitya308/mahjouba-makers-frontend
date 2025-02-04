import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box, IconButton } from 'native-base';
import SharpButton from 'components/SharpButton';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import MahjoubaLogo from '../../assets/mahjouba_logo.svg';
import styles from 'styles/onboarding';
import AudioIcon from '../../assets/audio_icon.svg';
import StopIcon from '../../assets/hand_icon.svg';
import * as Speech from 'expo-speech';
import TextHighlighter from 'components/SpeechHighlighter';
import AppStyles from 'styles/commonstyles';


export default function Authenticate({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const [pressed, setPressed] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Center flex={1}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <VStack space={2} alignItems="center">
            <MahjoubaLogo width='141px' height='104.88px' />
            <Box height='65px' width='100%' />
            <SharpButton my='10px' width={'80%'}
              size='sm' onPress={() => navigation.navigate('Login')}>
              <TextHighlighter style={AppStyles.buttonText} text={t('Sign In')} pressed={pressed} setPressed={setPressed} />
            </SharpButton>
            <SharpButton my='10px' width={'80%'}
              size='sm' onPress={() => navigation.navigate('Signup')}>
              <TextHighlighter style={AppStyles.buttonText} text={t('Sign Up')} pressed={pressed} setPressed={setPressed} />
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
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box, ScrollView, IconButton } from 'native-base';
import SharpButton from 'components/SharpButton';
import i18next from 'i18next';
import { Languages } from 'types/user';
import { SafeAreaView, View } from 'react-native';
import MahjoubaLogo from '../../assets/mahjouba_logo.svg';
import * as Speech from 'expo-speech';
import AudioIcon from '../../assets/audio_icon.svg';
import StopIcon from '../../assets/hand_icon.svg';
import TextHighlighter from '../../components/SpeechHighlighter';
import styles from 'styles/onboarding';
import AppStyles from 'styles/commonstyles';
import XIcon from '../../assets/x_icon.svg';

export default function Onboarding(modalClose: any) {

  const [pgNo, setPgNo] = useState(0);
  const textDisplay = [
    'Press the yellow hand button for the pages to be read aloud or a tutorial demonstration of each page.',
    'Choose pieces to build for the Mahjouba Motorcycle.',
    'Track the money you have made with Mahjouba.',
    'Learn new skills through workshops.',
    'Promote your personal brand through your profile.',
    'Let’s get started',
  ];

  const [pressed, setPressed] = useState(false);

  return (
    <View>
      <Center flex={1}>
        <TextHighlighter style={AppStyles.center_heading} text={textDisplay[pgNo]} pressed={pressed} setPressed={setPressed} />
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
    </View>
  );
}
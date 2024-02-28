import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box, ScrollView, IconButton } from 'native-base';
import SharpButton from 'components/SharpButton';
import i18next from 'i18next';
import { Languages } from 'types/user';
import { SafeAreaView } from 'react-native';
import * as Speech from 'expo-speech';
import AudioIcon from '../../assets/audio_icon.svg';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Highlighter } from 'react-highlighter';
import TextHighlight from './highlight';

export default function Welcome({ navigation }) {

  const handleLanguageSelection = (language: Languages) => {
    i18next.changeLanguage(language);
    navigation.navigate('Authenticate');
  };

  const handlePlay = () => {
    const inputValue = 'Welcome to the app. This is a test of the audio feature.';
    Speech.speak(inputValue, {
      onDone: () => {
        setBefore('Welcome to the app. This is a test of the audio feature.');
      },
      onBoundary: (boundaries: any) => {
        const { charIndex, charLength } = boundaries;
        const word = inputValue.substring(charIndex, charIndex + charLength);
        setBefore(inputValue.substring(0, charIndex));
        setCurr(word);
        setAfter(inputValue.substring(charIndex + charLength));
        // console.log(boundaries, word)
      },
    });
  };

  const [before, setBefore] = useState('Welcome to the app. This is a test of the audio feature.');
  const [curr, setCurr] = useState('');
  const [after, setAfter] = useState('');

  return (
    <SafeAreaView>
      <ScrollView>
        <VStack space={2}>
          <SharpButton w='100%' my='10px'
            size='sm' onPress={() => handleLanguageSelection(Languages.EN)}>
            <Text color='black' fontWeight='medium'>Welcome</Text>
            <TextHighlight before={before} curr={curr} after={after}></TextHighlight>
            <IconButton
              icon={<AudioIcon />}
              onPress={() => {
                handlePlay();
                // Speech.speak((text), { language: i18next.language });
              }}
            />
          </SharpButton>
          <SharpButton w='100%' my='10px'
            size='sm' onPress={() => handleLanguageSelection(Languages.FR)}>
            <Text color='black' fontWeight='medium'>French</Text>
          </SharpButton>
          <SharpButton w='100%' my='10px'
            size='sm' onPress={() => handleLanguageSelection(Languages.AR)}>
            <Text color='black' fontWeight='medium'>Arabic</Text>
          </SharpButton>
        </VStack>
      </ScrollView>
    </SafeAreaView>

  );
}

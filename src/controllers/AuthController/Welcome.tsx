import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box, ScrollView, IconButton } from 'native-base';
import SharpButton from 'components/SharpButton';
import i18next from 'i18next';
import { Languages } from 'types/user';
import { SafeAreaView } from 'react-native';
import * as Speech from 'expo-speech';
import AudioIcon from '../../assets/audio_icon.svg';
import TextHighlight from './highlight';
import TextHighlight2 from './highlight2';

export default function Welcome({ navigation }) {

  const handleLanguageSelection = (language: Languages) => {
    i18next.changeLanguage(language);
    navigation.navigate('Authenticate');
  };

  // const handlePlay = () => {
  //   const inputValue = 'Welcome to the app. This is a test of the audio feature.';
  //   Speech.speak(inputValue, {
  //     onDone: () => {
  //       setBefore('Welcome to the app. This is a test of the audio feature.');
  //       setCurr('');
  //       setAfter('');
  //     },
  //     onBoundary: (boundaries: any) => {
  //       const { charIndex, charLength } = boundaries;
  //       const word = inputValue.substring(charIndex, charIndex + charLength);
  //       setBefore(inputValue.substring(0, charIndex));
  //       setCurr(word);
  //       setAfter(inputValue.substring(charIndex + charLength));
  //       // console.log(boundaries, word)
  //     },
  //   });
  // };

  // const [before, setBefore] = useState('Welcome to the app. This is a test of the audio feature.');
  // const [curr, setCurr] = useState('');
  // const [after, setAfter] = useState('');

  const [press, setPressed] = useState(false);

  return (
    <SafeAreaView>
      <ScrollView>
        <VStack space={2}>
          <SharpButton w='100%' my='10px'
            size='sm' onPress={() => handleLanguageSelection(Languages.EN)}>
            <Text color='black' fontWeight='medium'>Welcome</Text>
            <TextHighlight2 text={'This is a welcome to my app'} pressed={press} setPressed={setPressed}></TextHighlight2>
            <IconButton
              icon={<AudioIcon />}
              onPress={() => {
                setPressed(true);
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

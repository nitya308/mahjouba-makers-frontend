import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Speech from 'expo-speech';
import i18next from 'i18next';

const TextHighlighter = ({ text, pressed, setPressed }: { text: string, pressed: boolean, setPressed: React.Dispatch<React.SetStateAction<boolean>> }) => {

  useEffect(() => {
    if (pressed) {
      handlePlay();
    }
  }, [pressed]);

  const handlePlay = () => {
    Speech.speak(text, 
      {
        onDone: () => {
          setBefore(text);
          setCurr('');
          setAfter('');
          setPressed(false);
        },
        onBoundary: (boundaries: any) => {
          const { charIndex, charLength } = boundaries;
          const word = text.substring(charIndex, charIndex + charLength);
          setBefore(text.substring(0, charIndex));
          setCurr(word);
          setAfter(text.substring(charIndex + charLength));
        },
        language: i18next.language,
      });
  };

  const [before, setBefore] = useState(text);
  const [curr, setCurr] = useState('');
  const [after, setAfter] = useState('');

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Text>{before}</Text>
      <Text style={{ backgroundColor: 'yellow' }}>{curr}</Text>
      <Text>{after}</Text>
    </View>
  );
};

export default TextHighlighter;
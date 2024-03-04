import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Speech from 'expo-speech';
import i18next from 'i18next';
import { HStack } from 'native-base';


const TextHighlighter = ({ text, pressed, setPressed, style }: { text: string, pressed: boolean, setPressed: React.Dispatch<React.SetStateAction<boolean>>, style: any }) => {
  useEffect(() => {
    if (pressed) {
      handlePlay();
    }
  }, [pressed]);
  const handlePlay = () => {
    Speech.speak(text,
      {
        onDone: () => {
          setBefore(text.substring(0, text.length));
          setCurr('');
          setAfter('');
          setPressed(false);
        },
        onBoundary: (boundaries: any) => {
          const { charIndex, charLength } = boundaries;
          const word = text.substring(charIndex, charIndex + charLength);
          setAfter(text.substring(charIndex + charLength));
          setCurr(word);
          setBefore(text.substring(0, charIndex));
        },
        language: i18next.language,
      });
  };
  const [before, setBefore] = useState(text);
  const [curr, setCurr] = useState('');
  const [after, setAfter] = useState('');
  return (
    <Text style={style}>
      <Text>{before}</Text>
      <Text style={{ backgroundColor: 'yellow' }}>{curr}</Text>
      <Text>{after}</Text>
    </Text>
  );
};
export default TextHighlighter;










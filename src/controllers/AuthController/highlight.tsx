import React from 'react';
import { View, Text } from 'react-native';

const TextHighlight = ({ before, curr, after }: { before: string, curr: string, after: string }) => {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Text>{before}</Text>
      <Text style={{ backgroundColor: 'yellow' }}>{curr}</Text>
      <Text>{after}</Text>
    </View>
  );
};

export default TextHighlight;
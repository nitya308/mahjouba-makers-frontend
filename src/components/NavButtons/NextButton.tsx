import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';

const NextButton = ({ onPress, text = 'Next' }: { onPress: () => void, text?: string }) => {
  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.back}>
        <Text style={styles.backText}>{text}</Text><AntDesign name='right' size={15} color='white' />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  backText: {
    color: 'white',
    fontFamily: 'Montserrat_400Regular',
    marginLeft: 3,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});


export default NextButton;
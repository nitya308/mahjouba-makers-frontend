import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';

const BackButton = ({ onPress }: { onPress?: () => void }) => {
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  
  return (
    <TouchableHighlight onPress={onPress || goBack}>
      <View style={styles.back}>
        <AntDesign name='left' size={15} color='white' /><Text style={styles.backText}>Back</Text>
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


export default BackButton;
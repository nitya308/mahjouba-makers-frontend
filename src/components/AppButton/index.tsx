import React from 'react';
import { GestureResponderEvent, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../utils/Colors';
import TextStyles from '../../utils/TextStyles';
import { fonts } from '../../utils/constants';

interface AppButtonProps {
  onPress: (event: GestureResponderEvent) => void
  title: string
  fullWidth?: boolean
  isArrow?: boolean
  backgroundColor?: string
  textColor?: string
  style?: StyleProp<ViewStyle>
  inverted?: boolean
  disabled?: boolean
  textStyle?: StyleProp<TextStyle>
}

const AppButton = ({ 
  onPress, 
  title, 
  isArrow, 
  fullWidth, 
  style, 
  textStyle,
  backgroundColor = 'white', 
  textColor = Colors.primary,
  inverted = false,
  disabled = false,
}: AppButtonProps) => (
  <TouchableOpacity 
    onPress={onPress} 
    disabled={disabled}
    style={{ 
      ...styles.appButtonContainer, 
      backgroundColor, 
      ...(style as object),
      ...(inverted) && { backgroundColor: Colors.primary }, 
      ...(fullWidth) && { width: '100%' }, 
      ...(disabled) && { opacity: 0.7 },
    }}>
    <Text style={[styles.appButtonText, { color: textColor, ...(inverted) && { color: Colors.white } }, textStyle]}>{title}</Text>
    {
      isArrow && <AntDesign name='caretright' size={25} color='white' />
    }
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  appButtonContainer: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  appButtonText: {
    ...TextStyles.subTitle,
    alignSelf: 'center',
    fontFamily: fonts.semiBold,
    fontSize: 18,
  },
});

export default AppButton;


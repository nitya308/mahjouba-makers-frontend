import React from 'react';
import { Input, Text, Box } from 'native-base';
import Colors from 'utils/Colors';
import { KeyboardTypeOptions, TextInputIOSProps, StyleProp, TextStyle } from 'react-native';

interface AppButtonProps {
  onChangeText: (text: string) => void
  value: string
  placeholder: string
  secureTextEntry?: boolean
  errorText?: string
  textContentType?: TextInputIOSProps['textContentType']
  keyboardType?: KeyboardTypeOptions
  icon?: JSX.Element
  rightElement?: JSX.Element
  multiline?: boolean,
  backgroundColor?: string,
  textStyle?: StyleProp<TextStyle>,
}

const AppTextInput = ({ 
  onChangeText, 
  value, 
  placeholder, 
  secureTextEntry, 
  errorText, 
  textContentType, 
  keyboardType, 
  icon, 
  rightElement,
  multiline,
  backgroundColor,
  textStyle,
}: AppButtonProps) => (
  <>
    <Input
      style={[
        textStyle,
      ]}
      onChangeText={(val) => onChangeText(val)}
      value={value}
      placeholder={placeholder}
      placeholderTextColor={Colors.white}
      color={Colors.white}
      secureTextEntry={(secureTextEntry === null || secureTextEntry === undefined) ? false : secureTextEntry}
      my={1}
      variant="filled"
      borderWidth={0}
      padding={4}
      borderRadius={10}
      focusOutlineColor={Colors.primary}
      textContentType={textContentType}
      keyboardType={keyboardType}
      multiline = {multiline}
      InputLeftElement={icon ? <Box pl={3}>{icon}</Box> : undefined}
      rightElement={rightElement}
      backgroundColor={backgroundColor || Colors.textInputBackground}
    />
    <Text color="red.500" fontSize={14}>{errorText || ' '}</Text>
  </>
);

export default AppTextInput;


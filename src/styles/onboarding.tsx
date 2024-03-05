import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

const OnboardingStyles = StyleSheet.create({
  italic: { fontStyle: 'italic' },
  heading: { fontSize: 30, color: 'white', textAlign: 'center' },
  subheading: { fontSize: 24, color: 'white', textAlign: 'center', textDecorationLine: 'underline' },
  audioStyle: { position: 'absolute', top: 0, right: 0, zIndex: 1, marginTop: 50, marginRight: 10 },
  buttonText: { fontSize: 20, color: 'white', textAlign: 'center', fontWeight: 'bold' },
  body: { fontSize: 20, color: 'white', textAlign: 'center' },
  small: { marginTop: 5, fontSize: 20, color: 'white' },
});

export default OnboardingStyles;
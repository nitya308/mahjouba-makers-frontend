import { StyleSheet } from 'react-native';

const OnboardingStyles = StyleSheet.create({
  italic: { fontStyle: 'italic' },
  heading: { fontSize: 30, color: 'white', textAlign: 'center' },
  subheading: { fontSize: 24, color: 'white', textAlign: 'center', textDecorationLine: 'underline' },
  audioStyle: { position: 'absolute', top: 0, right: 0, zIndex: 1 },
  buttonText: { fontsize: 20, color: 'white', textAlign: 'center', fontWeight: 'bold' },
});

export default OnboardingStyles;
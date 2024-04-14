import { StyleSheet } from 'react-native';

const OnboardingStyles = StyleSheet.create({
  italic: { fontStyle: 'italic' },
  heading: { fontSize: 30, textAlign: 'center' },
  inputLabel: { fontSize: 18, textAlign: 'left', width: '100%' },
  subheading: { fontSize: 24, textAlign: 'center', textDecorationLine: 'underline' },
  audioStyle: { position: 'absolute', top: 0, right: 0, zIndex: 1, marginTop: 50, marginRight: 10 },
  buttonText: { fontSize: 20, textAlign: 'center', fontWeight: 'bold' },
  body: { fontSize: 20, textAlign: 'center' },
  small: { marginTop: 5, fontSize: 20, color: 'white' },
  inputBoxStyle: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 0,
    fontSize: 18,
    backgroundColor: '#F2F1EC',
    shadowColor: '#3A3449',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
  },
});

export default OnboardingStyles;
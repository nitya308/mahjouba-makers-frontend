import { StyleSheet } from 'react-native';
import { fonts } from 'utils/constants';


const AppStyles = StyleSheet.create({
  italic: { fontStyle: 'italic' },
  heading: { fontSize: 30, color: 'white', textAlign: 'left' },
  center_heading: { fontSize: 30, color: 'white', textAlign: 'center', fontFamily: fonts.bold },
  underline: { textDecorationLine: 'underline', color: 'white' },
  audioStyle: { position: 'absolute', top: 5, right: 5, zIndex: 1 },
});

export default AppStyles;
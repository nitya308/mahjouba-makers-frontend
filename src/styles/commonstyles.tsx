import { StyleSheet } from 'react-native';
import { fonts } from 'utils/constants';


const AppStyles = StyleSheet.create({
  italic: { fontStyle: 'italic' },
  heading: { fontSize: 30, textAlign: 'left' },
  center_heading: { fontSize: 32, textAlign: 'center', fontFamily: fonts.bold },
  left_heading: { fontSize: 32, textAlign: 'left', fontFamily: fonts.bold },
  underline: { textDecorationLine: 'underline' },
  audioStyle: { position: 'absolute', top: 5, right: 5, zIndex: 1 },
  mainContainer: { paddingHorizontal: 20, height: '100%' },
  buttonText: { color: 'white', fontSize: 18, fontFamily: fonts.bold},
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
});

export default AppStyles;
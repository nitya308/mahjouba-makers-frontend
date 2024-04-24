import { StyleSheet } from 'react-native';
import { fonts } from 'utils/constants';
import { ScreenHeight } from 'react-native-elements/dist/helpers';

const AppStyles = StyleSheet.create({
  italic: { fontStyle: 'italic' },
  heading: { fontSize: 30, textAlign: 'left' },
  center_heading: { fontSize: 32, lineHeight: 32, textAlign: 'center', fontFamily: fonts.bold },
  left_heading: { fontSize: 32, lineHeight: 32, textAlign: 'left', fontFamily: fonts.bold },
  bodyText: { fontSize: 18 },
  bodyTextMd: { fontSize: 20 },
  bodyTextLg: { fontSize: 25 },
  underline: { textDecorationLine: 'underline' },
  audioStyle: { position: 'absolute', top: 0, right: 0, zIndex: 1 },
  audioButtonStyle: {
    position: 'absolute',
    top: ScreenHeight - 200,
    right: 5,
    zIndex: 1,
    shadowColor: '#3A3449',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
  },
  mainContainer: { paddingHorizontal: 20, height: '100%' },
  buttonText: { color: 'white', fontSize: 18, fontFamily: fonts.bold },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
  materialBoxStyle: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 0,
    fontSize: 18,
    shadowColor: '#3A3449',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
  },
});

export default AppStyles;
import { StyleSheet, Dimensions } from 'react-native';

const FormatStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  innerContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: Dimensions.get('window').width * (6 / 7),
    paddingBottom: 0,
  },

  button: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 100,
    backgroundColor: '#C4C4C4',
    marginTop: 60,
  },

  circle: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#C4C4C4',
    marginTop: 20,
  },

  lf: {
    fontSize: 27.5,
  },
});

export default FormatStyle;

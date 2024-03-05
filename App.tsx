
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import RootNavigation from './src/navigation';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { fonts } from 'utils/constants';
import { useFonts as ExpoUseFonts } from 'expo-font';
import 'react-native-devsettings/withAsyncStorage';
import './src/utils/i18n';
//I changed universdondensed to koho,
const theme = extendTheme({
  fontConfig: {
    UniversCondensed: {
      400: {
        normal: fonts.regular,
      },
      500: {
        normal: fonts.regular,
      },
      600: {
        normal: fonts.bold,
      },
    },
  },
  fonts: {
    heading: [fonts.bold],
    body: [fonts.regular],
    mono: [fonts.regular],
  },
});

export default function App() {
  const [fontsLoaded] = ExpoUseFonts({
    [fonts.regular]: require('./src/assets/fonts/KoHo-Regular.ttf'),
    [fonts.bold]: require('./src/assets/fonts/KoHo-Regular.ttf'),
    [fonts.regular]: require('./src/assets/fonts/KoHo-Regular.ttf'),
    [fonts.regular]: require('./src/assets/fonts/KoHo-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <></>;
  }
  
  return (
    <NativeBaseProvider theme={theme}>
      <Provider store={store}>
        <RootNavigation />
      </Provider>
    </NativeBaseProvider>
  );
}



import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import RootNavigation from './src/navigation';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { fonts } from 'utils/constants';
import { useFonts as ExpoUseFonts } from 'expo-font';

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
    [fonts.regular]: require('./src/assets/fonts/universCondensed.otf'),
    [fonts.bold]: require('./src/assets/fonts/universCondensedBold.ttf'),
    [fonts.regular]: require('./src/assets/fonts/universCondensedItalic.ttf'),
    [fonts.regular]: require('./src/assets/fonts/universCondensedRegular.otf'),
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


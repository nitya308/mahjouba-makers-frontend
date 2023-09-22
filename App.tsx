import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import RootNavigation from './src/navigation';
import { useFonts, Raleway_400Regular, Raleway_600SemiBold, Raleway_800ExtraBold } from '@expo-google-fonts/raleway';
import { Montserrat_600SemiBold, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { fonts } from 'utils/constants';
import firebase, { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

const theme = extendTheme({
  fontConfig: {
    Montserrat: {
      400: {
        normal: fonts.regular,
      },
      500: {
        normal: fonts.medium,
      },
      600: {
        normal: fonts.semiBold,
      },
    },
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
    mono: 'Montserrat',
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_600SemiBold,
    Raleway_800ExtraBold,
    Montserrat_600SemiBold,
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  // useEffect(() => {
  //   if (!(firebase as any).apps.length) {
  //     initializeApp(firebaseConfig);
  //   }
  // }, []);

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


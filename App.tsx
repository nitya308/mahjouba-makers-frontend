
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import RootNavigation from './src/navigation';
import { useFonts, Raleway_400Regular, Raleway_600SemiBold, Raleway_800ExtraBold } from '@expo-google-fonts/raleway';
import { Montserrat_600SemiBold, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { Barlow_600SemiBold, Barlow_300Light, Barlow_400Regular } from '@expo-google-fonts/barlow';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { fonts } from 'utils/constants';
import firebase, { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase';

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
    Barlow: {
      300: {
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
    heading: 'Barlow',
    body: 'Barlow',
    mono: 'Barlow',
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
    // 
    Barlow_600SemiBold,
    Barlow_300Light,
    Barlow_400Regular,
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


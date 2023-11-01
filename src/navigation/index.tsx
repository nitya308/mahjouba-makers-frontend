import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';
import { UserScopes } from 'types/user';
import { checkConnection } from 'redux/slices/connectionSlice';
import { initCredentials, logout, handleAuthStateChanged } from 'redux/slices/authSlice';
import BaseNavigation from './BaseNavigation';
import AuthController from 'controllers/AuthController';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import UserSetup from 'components/Setup';
import { getUser, userDataSelector } from 'redux/slices/userDataSlice';
import { Center, Spinner, View } from 'native-base';
import ProfileImageSelector from 'components/ProfileImageSelector';

const RootNavigation = () => {
  const { isConnected } = useAppSelector((state) => state.connection);
  const { authenticated, role } = useAppSelector((state) => state.auth);
  const { userData, loading } = useAppSelector(userDataSelector);
    
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkConnection()).finally(() => { });
  }, []);
  useEffect(() => {
    dispatch(initCredentials({})).finally(() => { });
  }, []);

  const initialized = useMemo(() => {
    return userData !== undefined;
  }, [userData, loading]);
  // When the app loads, try to log in with token stored in async storage
  // useEffect(() => {
  //   if (isConnected) {
  //     dispatch(jwtSignIn({}));
  //   }
  // }, [isConnected]);

  useEffect(() => {
    const authListener = onAuthStateChanged(auth, async (user: User | null) => {
      dispatch(handleAuthStateChanged(user));
      if (user) {
        dispatch(getUser({ fbUserRef: user }));
      }
    });

    return () => {
      if (authListener) {
        authListener();
      }
    };
  }, []);
  
  if (!authenticated) {
    return (
      <AuthController />
    );
  } else if (loading) {
    return <View flex='1'>
      <Center h='100%'>
        <Spinner />
      </Center>
    </View>;
  } else if (authenticated && !initialized) {
    return (
      <UserSetup />
    );
  } else {
    return (
      <BaseNavigation />
    );
  }
};

export default RootNavigation;
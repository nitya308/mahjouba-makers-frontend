import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';
import { UserScopes } from 'types/users';
import { checkConnection } from 'redux/slices/connectionSlice';
import { initCredentials, jwtSignIn } from 'redux/slices/authSlice';
import { VerifyPage } from 'screens/AuthScreens';
import AuthNavigation from './AuthNavigation';
import BaseNavigation from './BaseNavigation';

const RootNavigation = () => {
  const { isConnected } = useAppSelector((state) => state.connection);
  const { authenticated, role } = useAppSelector((state) => state.auth);
  
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkConnection()).finally(() => { });
  }, []);
  useEffect(() => {
    dispatch(initCredentials({})).finally(() => { });
  }, []);
  // When the app loads, try to log in with token stored in async storage
  useEffect(() => {
    if (isConnected) {
      dispatch(jwtSignIn({}));
    }
  }, [isConnected]);
  
  if (!authenticated) {
    return (
      <AuthNavigation />
    );
  } else if (authenticated && role === UserScopes.Unverified) {
    return (
      <NavigationContainer>
        <VerifyPage />
      </NavigationContainer>
    );
  } else {
    return (
      <BaseNavigation />
    );
  }
};

export default RootNavigation;
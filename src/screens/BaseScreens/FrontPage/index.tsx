import React from 'react';
import BaseView from 'components/BaseView';
import { Text, VStack } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { fonts } from 'utils/constants';
import { useNavigation } from '@react-navigation/native';
import { BaseTabRoutes } from 'navigation/routeTypes';
import NavType from 'utils/NavType';

const FrontPage = () => {
  const { name } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<NavType>();
  
  return (
    <BaseView smallLogo showTopRightIcon logoText={'App Title'}>
      <VStack height="100%" pt={150}>
        <Text color="white" fontSize={24} fontFamily={fonts.medium}>{`Welcome back, ${name}`}</Text>
      </VStack>
    </BaseView>
  );
};

export default FrontPage;

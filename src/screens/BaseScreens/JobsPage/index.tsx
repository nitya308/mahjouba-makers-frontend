import React from 'react';
import BaseView from 'components/BaseView';
import { Text, VStack } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { fonts } from 'utils/constants';
import { useNavigation } from '@react-navigation/native';
import { BaseTabRoutes } from 'navigation/routeTypes';
import NavType from 'utils/NavType';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { jobsSelector } from 'redux/slices/jobsSlice';

const JobsPage = () => {
  const { userData } = useAppSelector(userDataSelector);
  const { jobs } = useAppSelector(jobsSelector);
  
  return (
    <BaseView smallLogo showTopRightIcon logoText={'App Title'}>
      <VStack height="100%" pt={150}>
        {
          userData?.name &&
          <Text fontSize={24} fontFamily={fonts.medium}>{`Welcome back, ${userData.name}`}</Text>
        }
        <Text>Jobs:</Text>
        {
          jobs.map(j => <Text>{JSON.stringify(j)}</Text>)
        }
      </VStack>
    </BaseView>
  );
};

export default JobsPage;

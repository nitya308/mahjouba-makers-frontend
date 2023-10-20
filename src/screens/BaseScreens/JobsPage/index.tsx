import React from 'react';
import BaseView from 'components/BaseView';
import { Text, VStack, Button } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { fonts } from 'utils/constants';
import { useNavigation } from '@react-navigation/native';
import { BaseTabRoutes } from 'navigation/routeTypes';
import NavType from 'utils/NavType';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { jobsSelector, pullNextJobsPage } from 'redux/slices/jobsSlice';
import useAppDispatch from 'hooks/useAppDispatch';
import { authSelector } from 'redux/slices/authSlice';

const JobsPage = ({
  setSortField,
  setSortOrder,
  pullNextPage,
}: {
  setSortField: (newField?: string) => void;
  setSortOrder: (order: 1 | -1) => void;
  pullNextPage: () => void;
}) => {
  const { userData } = useAppSelector(userDataSelector);
  const { jobs, cursor } = useAppSelector(jobsSelector);

  return (
    <BaseView smallLogo showTopRightIcon logoText={'App Title'}>
      <VStack height="100%" pt={150}>
        {
          userData?.name &&
          <Text fontSize={24} fontFamily={fonts.medium}>{`Welcome back, ${userData.name}`}</Text>
        }
        <Text>Jobs:</Text>
        {
          jobs.map(j => <Text key={j._id} m='5px'>{JSON.stringify(j)}</Text>)
        }
        {
          cursor &&
          <Button onPress={pullNextPage} m='5px'>
            pull next page
          </Button>
        }
        <Button onPress={() => setSortField('price')} m='5px'>
          sort by price
        </Button>
        <Button onPress={() => setSortField(undefined)} m='5px'>
          unsort
        </Button>
      </VStack>
    </BaseView>
  );
};

export default JobsPage;

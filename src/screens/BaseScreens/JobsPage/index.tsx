import React from 'react';
import BaseView from 'components/BaseView';
import JobCard from 'components/JobCard';
import { StyleSheet } from 'react-native';
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
import { Pressable } from 'react-native';
import { Job } from 'types/job';
import { ScrollView } from 'react-native-gesture-handler';
import { Material } from 'types/material';

const JobsPage = ({
  setSortField,
  setSortOrder,
  pullNextPage,
  handleSelect,
  reloadJobs,
}: {
  setSortField: (newField?: string) => void;
  setSortOrder: (order: 1 | -1) => void;
  pullNextPage: () => void;
  handleSelect: (job?: Job) => void;
  reloadJobs: () => void;
}) => {
  const { userData } = useAppSelector(userDataSelector);
  const { jobs, cursor, partsMap, materialsMap } = useAppSelector(jobsSelector);

  console.log('materialsMap', materialsMap); 
  console.log('partsMap', partsMap);

  return (
    <ScrollView>
      <BaseView smallLogo showTopRightIcon logoText={'App Title'}>
        <VStack height="100%" width='90%' pt={150} paddingBottom={100}>
          <Text fontSize={24} fontFamily={fonts.medium}>Job Search</Text>
          {
            jobs && partsMap && materialsMap && jobs.map((j: Job) => {
              const job = j;
              const part = partsMap[j.partTypeId];
              let materials: Material[] = [];
              if (part.materialIds) {
                materials = part.materialIds.map((materialId: string) => materialsMap[materialId]);
              }

              console.log('materials', materials);

              // const materialIds = part.materialIds || [];
              // const materials = materialIds.map((materialId) => materialsMap[materialId]);

              return (
                <Pressable style={styles.jobCard} key={job._id} onPress={() => handleSelect(job)}>
                  <JobCard job={job} part={part} materials={materials}/>
                </Pressable>
              );
            })
          }
          {
            cursor &&
            <Button onPress={pullNextPage} m='5px'>
              pull next page
            </Button>
          }
          <Button onPress={reloadJobs} m='5px'>
            reload
          </Button>
          <Button onPress={() => setSortField('price')} m='5px'>
            sort by price
          </Button>
          <Button onPress={() => setSortField(undefined)} m='5px'>
            unsort
          </Button>
        </VStack>
      </BaseView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  jobCard: {
    marginBottom: 15,
  },
});

export default JobsPage;

import React, { useEffect, useState } from 'react';
import BaseView from 'components/BaseView';
import JobCard from 'components/JobCard';
import { StyleSheet } from 'react-native';
import { Text, VStack, Button, IconButton, Spinner } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { fonts } from 'utils/constants';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { jobsSelector, pullNextJobsPage } from 'redux/slices/jobsSlice';
import { Pressable } from 'react-native';
import { Job } from 'types/job';
import { ScrollView } from 'react-native-gesture-handler';
import AudioIcon from '../../../assets/audio_icon.svg';
import * as Speech from 'expo-speech';

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
  const { cursor, jobFeedIds, jobsMap, partsMap, materialsMap, loading, currentJobId } = useAppSelector(jobsSelector);

  if (loading) {
    return <Spinner />;
  }

  return (
    <ScrollView>
      <BaseView smallLogo showTopRightIcon>
        <VStack height="100%" width="90%" marginTop={'150px'} paddingBottom={100}>
          <Text fontSize={24} fontFamily={fonts.regular}>Job Search
            <IconButton
              icon={<AudioIcon />}
              onPress={() => {
                Speech.speak('Job Search');
              }}
            />
          </Text>
          {jobFeedIds.map((jobId: string) => {
            const job = jobsMap[jobId];
            const part = partsMap[job.partTypeId];
            const materials = part?.materialIds?.map((materialId: string) => {
              const material = materialsMap[materialId];
              return material ? material.name : ''; // Return the name if available, otherwise an empty string
            });

            return (
              <Pressable style={styles.jobCard} key={job._id} onPress={() => handleSelect(job)}>
                <JobCard job={job} part={part} materials={materials} />
              </Pressable>
            );
          })}
          {cursor && (
            <Button onPress={pullNextPage} m='5px'>
              pull next page
            </Button>
          )}
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
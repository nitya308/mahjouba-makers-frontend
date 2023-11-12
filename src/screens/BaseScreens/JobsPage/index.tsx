import React, { useEffect, useState } from 'react';
import BaseView from 'components/BaseView';
import JobCard from 'components/JobCard';
import { StyleSheet } from 'react-native';
import { Text, VStack, Button, IconButton } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { fonts } from 'utils/constants';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { jobsSelector, pullNextJobsPage } from 'redux/slices/jobsSlice';
import { Pressable } from 'react-native';
import { Job } from 'types/job';
import { ScrollView } from 'react-native-gesture-handler';
import AppModal from 'components/AddModal';
import AddIcon from '../../../assets/add_icon.svg';
import MaterialSelector from 'components/MaterialSelector';

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

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);

  useEffect(() => {
    if (partsMap && Object.keys(partsMap).length > 0 && materialsMap && Object.keys(materialsMap).length > 0) {
      setLoading(false);
    }
  }, [partsMap, materialsMap]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView>
      <BaseView smallLogo showTopRightIcon>
        <VStack height="100%" width="90%" marginTop={'150px'} paddingBottom={100}>
          <AppModal 
            showModal={showModal}
            setShowModal={setShowModal}
            modalButton={
              <IconButton
                icon={<AddIcon />}
                onPress={() => {
                  setShowModal(true);
                }}
              />
            }
          >
            {/* TODO: Put MaterialSelector here */}
          </AppModal>
          <Text fontSize={24} fontFamily={fonts.regular}>Job Search</Text>
          {jobs.map((j: Job) => {
            const job = j;
            const part = partsMap[j.partTypeId];
            const materials = part.materialIds.map((materialId: string) => {
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

import React, { useEffect, useState } from 'react';
import BaseView from 'components/BaseView';
import JobCard from 'components/JobCard';
import { StyleSheet } from 'react-native';
import { Text, VStack, Button, IconButton, Spinner } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { fonts } from 'utils/constants';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { jobsSelector, pullNextJobsPage } from 'redux/slices/jobsSlice';
import { Pressable, View } from 'react-native';
import { Job } from 'types/job';
import { ScrollView } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import { Modal } from 'react-native';
import { Box, HStack } from 'native-base';
import MaterialChip from '../../../components/MaterialChip';
import { IMaterial } from 'types/material';
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
  const { cursor, jobFeedIds, jobsMap, partsMap, materialsMap, loading, currentJobId } = useAppSelector(jobsSelector);

  const [isModalVisible, setModalVisible] = useState(false);
  const [jobsAvailable, setJobsAvailable] = useState(false);
  const materialNames = Object.values(materialsMap).map(material => material.name);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>(userData?.materialIds ? userData?.materialIds : []);

  // useEffect(() => {
  //   console.log('starting use effect', selectedMaterialIds);
  //   if (userData?.materialIds && selectedMaterialIds.length == 0) {
  //     console.log('in if, setting backl to []');
  //     setSelectedMaterialIds(userData?.materialIds);
  //   }
  //   console.log('in use effect after end', selectedMaterialIds);
  // }, [userData]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    setJobsAvailable(false);
  }, [selectedMaterialIds]);

  const customCheckedIcon = (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 0,
        backgroundColor: '#D1963A', // Change this to the desired color
      }}
    />
  );
  if (loading) {
    return <Spinner />;
  }

  return (
    <ScrollView>
      <BaseView smallLogo showTopRightIcon>
        <VStack height="100%" width="90%" marginTop={'150px'} paddingBottom={100}>
          <Text fontSize={24} fontFamily={fonts.regular}>Job Search</Text>
          {/* {
            userData?.materialIds?.map((materialId: string) => {
              const material = materialsMap[materialId];
              // if (material) {
              //   console.log(material.name);
              //   // return <MaterialChip materialName={material?.name} />;
              // }
              
              return <></>;
            })
          } */}
          <View>
            <TouchableOpacity onPress={toggleModal} style={styles.button}>
              {
                Object.values(materialsMap)?.map((material: IMaterial) => {
                  if (material) {
                    <Text>{material.name}</Text>;
                  }
              
                  return <></>;
                })
              }
              <Text style={styles.plusSign}>+</Text>
            </TouchableOpacity>
            <Modal visible={isModalVisible} animationType="fade" transparent={true}  >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text>Select Materials</Text>
                  <MaterialSelector
                    selectedMaterialIds={selectedMaterialIds}
                    setSelectedMaterialIds={setSelectedMaterialIds}
                    
                  />
                  {/* Your popup content goes here */}
                  <TouchableOpacity onPress={toggleModal}>
                    <Text>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          {jobFeedIds.map((jobId: string) => {
            const job = jobsMap[jobId];
            const part = partsMap[job.partTypeId];
            const materials = part?.materialIds?.map((materialId: string) => {
              const material = materialsMap[materialId];
              return material ? material.name : ''; // Return the name if available, otherwise an empty string
            });

            //check to see if no jobs are available with given materials
            if (part?.materialIds && part?.materialIds.some(materialId => selectedMaterialIds.includes(materialId))) {
              if (!jobsAvailable) {
                setJobsAvailable(true);
              }
              return (
                <Pressable style={styles.jobCard} key={job._id} onPress={() => handleSelect(job)}>
                  <JobCard job={job} part={part} materials={materials} />
                </Pressable>
              );
            }
            console.log('jobs available is ', jobsAvailable);
          })}
          {
            !jobsAvailable && (<View><Text>No Jobs Available with your Selected Materials</Text></View>)
          }
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
  button: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#080026',
    backgroundColor: '#FFFDF6',
    width: 28,
    height: 29,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  plusSign: {
    fontSize: 18,
    color: '#080026',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: 370,
    alignItems: 'center',
  },
  
});

export default JobsPage;

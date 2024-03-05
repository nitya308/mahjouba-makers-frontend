import React, { useEffect, useState } from 'react';
import BaseView from 'components/BaseView';
import JobCard from 'components/JobCard';
import { Animated, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, VStack, Button, IconButton, Spinner } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { fonts } from 'utils/constants';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { jobsSelector, pullNextJobsPage } from 'redux/slices/jobsSlice';
import { Pressable, View } from 'react-native';
import { Job } from 'types/job';
import { CheckBox } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import { Modal } from 'react-native';
import { Box, HStack } from 'native-base';
import MaterialChip from '../../../components/MaterialChip';
import { IMaterial } from 'types/material';
import MaterialSelector from 'components/MaterialSelector';
import { useTranslation } from 'react-i18next';
import AudioIcon from '../../../assets/audio_icon.svg';
import * as Speech from 'expo-speech';
import i18next from 'i18next';
import { integer } from 'aws-sdk/clients/cloudfront';
import { PartType } from 'types/part_type';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';

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
  const { t } = useTranslation();

  const [isModalVisible, setModalVisible] = useState(false);
  const materialNames = Object.values(materialsMap).map(material => material.name);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [scrollViewWidth, setScrollViewWidth] = React.useState(0);
  const boxWidth = scrollViewWidth * 0.8;
  const boxDistance = scrollViewWidth - boxWidth;
  const halfBoxDistance = boxDistance / 2;
  const pan = React.useRef(new Animated.ValueXY()).current;
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const updateResultArray = () => {
    console.log('darawuzhere', jobFeedIds);
    const transformedArray = jobFeedIds.flatMap((jobId) => {
      const job = jobsMap[jobId];
      const part = partsMap[job.partTypeId];

      if (part?.materialIds && part?.materialIds.some(materialId => selectedMaterialIds.includes(materialId))) {
        const materials = part?.materialIds?.map((materialId) => {
          const material = materialsMap[materialId];
          return material ? material.name : '';
        }) || [];

        return [{
          job,
          part,
          materials,
        }];
      } else {
        return []; // Return an empty array for entries that don't match the condition
      }
    });

    setResultArray(transformedArray);
  };

  const [resultArray, setResultArray] = useState<{ job: Job, part: PartType, materials: string[] }[]>([]);
  useEffect(() => {
    updateResultArray();

  }, [selectedMaterialIds, materialsMap, jobFeedIds, jobsMap, partsMap]);

  useEffect(() => {
    if (resultArray.length == 0) {
      updateResultArray();
    }
    if (selectedMaterialIds.length == 0) {
      setSelectedMaterialIds(userData?.materialIds ? userData?.materialIds : []);

    }

  }, []);

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

  const renderItem = ({ item, index }: { item: { job: Job, part: PartType, materials: string[]
  }, index: number }) => (
    <Animated.View
      style={{
        transform: [
          {
            scale: pan.x.interpolate({
              inputRange: [
                (index - 1) * boxWidth - halfBoxDistance,
                index * boxWidth - halfBoxDistance,
                (index + 1) * boxWidth - halfBoxDistance,
              ],
              outputRange: [0.8, 1, 0.8],
              extrapolate: 'clamp',
            }),
          },
        ],
      }}>
      <View style={{ alignContent:'center', alignItems:'center' }}>
        <Pressable style={styles.jobCard} key={item.job._id} onPress={() => handleSelect(item.job)}>
          <JobCard job={item.job} part={item.part} materials={item.materials} />
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderListEmpty = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>No Jobs Available with your Selected Materials</Text>
    </View>
  );
  
  
  if (loading) {
    return <Spinner />;
  }

  return (
    <GestureHandlerRootView>
    
      <View style={{ width:'100%' } }>
        <ScrollView>
          <BaseView smallLogo showTopRightIcon>
            <VStack height="100%" width="90%" marginTop={'150px'} paddingBottom={100}>
              <Text fontSize={24} fontFamily={fonts.regular} color={'#ffffff'}>{t('Job Search')}
                <IconButton
                  icon={<AudioIcon />}
                  onPress={() => {
                    Speech.speak(t('Job Search'), { language: i18next.language });
                  }}
                />
              </Text>
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
                      <TouchableOpacity onPress={toggleModal}>
                        <Text>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
              <FlatList
                horizontal
                data={resultArray}
                style={{ height: 250,  marginTop:30, paddingBottom: 500 }}
                contentContainerStyle={{ paddingVertical: 16 }}
                contentInsetAdjustmentBehavior="never"
                snapToAlignment="center"
                decelerationRate="fast"
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                snapToInterval={(boxWidth * 2.4)}
                ListEmptyComponent={renderListEmpty} 
                contentInset={{
                  left: halfBoxDistance,
                  right: halfBoxDistance,
                }}
                contentOffset={{ x: halfBoxDistance * -1, y: 0 }}
                onLayout={(e) => {
                  setScrollViewWidth(e.nativeEvent.layout.width);
                  console.log(scrollViewWidth);
                }}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: pan.x } } }],
                  {
                    useNativeDriver: false,
                  },
                )}
                renderItem={renderItem}
                keyExtractor={(item) => item.job._id} // assuming jobId is a unique identifier
              />
              
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
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  jobCard: {
    alignSelf: 'center',
    width: ScreenWidth * .7,
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
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
  const [jobsAvailable, setJobsAvailable] = useState(false);
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

  // const resultArray = jobFeedIds.map((jobId) => {
  //   const job = jobsMap[jobId];
  //   const part = partsMap[job.partTypeId];
  //   const materials = part?.materialIds?.map((materialId) => {
  //     const material = materialsMap[materialId];
  //     return material ? material.name : '';
  //   });
  
  //   // Assuming you want to return an object with the relevant information
  //   return {
  //     jobId,
  //     //return name later
  //     partName: part ? part.name : '',
  //     materials: materials || [],
  //   };
  // });

  const resultArray: { jobId: string; partName: string; material: string; }[] = jobFeedIds.flatMap((jobId) => {
    const job = jobsMap[jobId];
    const part = partsMap[job.partTypeId];
    const materials = part?.materialIds?.map((materialId) => {
      const material = materialsMap[materialId];
      return material ? material.name : '';
    }) || [];
  
    return materials.map((material) => ({
      jobId,
      partName: part ? part.name : '',
      material,
    }));
  });
  
  // resultArray now contains arrays with job id, part name, and material for each entry
  console.log('test3333', resultArray);
  

  useEffect(() => {
    // console.log('hello', resultArray);
    setJobsAvailable(false);
  }, [selectedMaterialIds]);

  useEffect(() => {
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

  //   const products = data.map(obj => ({title: obj.title, description: obj.description}))
  // this.setState({isLoaded: true, products})

  // const resultArray = jobFeedIds.map((jobId) => {
  //   const job = jobsMap[jobId];
  //   const part = partsMap[job.partTypeId];
  //   const materials = part?.materialIds?.map((materialId) => {
  //     const material = materialsMap[materialId];
  //     return material ? material.name : '';
  //   });
  
  // {jobFeedIds.map((jobId: string) => {
  //   const job = jobsMap[jobId];
  //   const part = partsMap[job.partTypeId];
  //   const materials = part?.materialIds?.map((materialId: string) => {
  //     const material = materialsMap[materialId];
  //     return material ? material.name : '';
  //   });
  // })}

  
  // const renderItem = ({ item, index }: { item: string, index: integer }) => (
  //   // jobs should be loaded into map here)

  //   // {jobFeedIds.map((jobId: string) => {
  //   //   const job = jobsMap[jobId];
  //   //   const part = partsMap[job.partTypeId];
  //   //   const materials = part?.materialIds?.map((materialId: string) => {
  //   //     const material = materialsMap[materialId];
  //   //     return material ? material.name : '';
  //   //   });
  //   // })}

    
    
    
  //   <Animated.View
  //     style={{
  //       transform: [
  //         {
  //           scale: pan.x.interpolate({
  //             inputRange: [
  //               (index - 1) * boxWidth - halfBoxDistance,
  //               index * boxWidth - halfBoxDistance,
  //               (index + 1) * boxWidth - halfBoxDistance, // adjust positioning
  //             ],
  //             outputRange: [0.8, 1, 0.8], // scale down when out of scope
  //             extrapolate: 'clamp',
  //           }),
  //         },
  //       ],
  //     }}>
  //     <View style={{
  //       height: '100%',
  //       width: boxWidth,
  //       borderRadius: 24,
  //       backgroundColor: `rgba(${(index * 13) % 255}, ${(index * 35) % 255
  //       }, ${(index * 4) % 255}, .5)`,
  //     }}>
  //       {/* pressable job card should be returned here */}
  //       {/* <Pressable style={styles.jobCard} key={job._id} onPress={() => handleSelect(job)}>
  //         <JobCard job={job} part={part} materials={materials} />
  //       </Pressable> */}
  //       <Text>{item}</Text>
  //     </View>
  //   </Animated.View>
  // );

  // const renderItem = ({ item, index }: { item: {
  //   jobId: string,
  //   partName: string,
  //   material: string,
  // }, index:integer }) => (


  //   <View>
  //     <Text>Job ID: {item.jobId}</Text>
  //     <Text>Material: {item.material}</Text>
  //     <Text>Part Name: {item.partName}</Text>
  //     {/* Add additional information or styling as needed */}
  //   </View>
  // );


  const renderItem = ({ item, index }: { item: {
    jobId: string,
    partName: string,
    material: string,
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
      <View>
        <Text>Job ID: {item.jobId}</Text>
        <Text>Material: {item.material}</Text>
        <Text>Part Name: {item.partName}</Text>
        {/* Add additional information or styling as needed */}
      </View>
    </Animated.View>
  );
  
  
  if (loading) {
    return <Spinner />;
  }

  return (
    <View style={{ width:'100%' } }>

      <FlatList
        horizontal
        data={resultArray}
        // data={resultArray}
        style={{ backgroundColor: '#6b6b6b', height: 250 }}
        contentContainerStyle={{ paddingVertical: 16 }}
        contentInsetAdjustmentBehavior="never"
        snapToAlignment="center"
        decelerationRate="fast"
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        snapToInterval={boxWidth}
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
        keyExtractor={(item) => item.jobId} // assuming jobId is a unique identifier
      />

      {/* <FlatList horizontal
        data={['hello', 'dara', 'is', 'here', 'test', 'one', 'two']}
        // data={resultArray}
        style={{ backgroundColor: '#6b6b6b', height: 250 }}
        contentContainerStyle={{ paddingVertical: 16 }}
        contentInsetAdjustmentBehavior="never"
        snapToAlignment="center"
        decelerationRate="fast"
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        snapToInterval={boxWidth}
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
        keyExtractor={(item, index) => `${index}-${item}`}
        renderItem={renderItem}
      >

      
      </FlatList> */}
    </View>
    // <ScrollView>
    //   <BaseView smallLogo showTopRightIcon>
    //     <VStack height="100%" width="90%" marginTop={'150px'} paddingBottom={100}>
    //       <Text fontSize={24} fontFamily={fonts.regular}>{t('Job Search')}
    //         <IconButton
    //           icon={<AudioIcon />}
    //           onPress={() => {
    //             Speech.speak(t('Job Search'), { language: i18next.language });
    //           }}
    //         />
    //       </Text>
    //       <View>
    //         <TouchableOpacity onPress={toggleModal} style={styles.button}>
    //           {
    //             Object.values(materialsMap)?.map((material: IMaterial) => {
    //               if (material) {
    //                 <Text>{material.name}</Text>;
    //               }

  //               return <></>;
  //             })
  //           }

  //           <Text style={styles.plusSign}>+</Text>
  //         </TouchableOpacity>
  //         <Modal visible={isModalVisible} animationType="fade" transparent={true}  >
  //           <View style={styles.modalContainer}>
  //             <View style={styles.modalContent}>
  //               <Text>Select Materials</Text>
  //               <MaterialSelector
  //                 selectedMaterialIds={selectedMaterialIds}
  //                 setSelectedMaterialIds={setSelectedMaterialIds}

  //               />
  //               <TouchableOpacity onPress={toggleModal}>
  //                 <Text>Close</Text>
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         </Modal>
  //       </View>
  //       {jobFeedIds.map((jobId: string) => {
  //         const job = jobsMap[jobId];
  //         const part = partsMap[job.partTypeId];
  //         const materials = part?.materialIds?.map((materialId: string) => {
  //           const material = materialsMap[materialId];
  //           return material ? material.name : ''; // Return the name if available, otherwise an empty string
  //         });

  //         //check to see if no jobs are available with given materials
  //         if (part?.materialIds && part?.materialIds.some(materialId => selectedMaterialIds.includes(materialId))) {
  //           if (!jobsAvailable) {
  //             setJobsAvailable(true);
  //           }
  //           return (
  // <Pressable style={styles.jobCard} key={job._id} onPress={() => handleSelect(job)}>
  //   <JobCard job={job} part={part} materials={materials} />
  // </Pressable>
  //           );
  //         }
  //       })}
  //       {
  //         !jobsAvailable && (<View><Text>No Jobs Available with your Selected Materials</Text></View>)
  //       }
  //       {cursor && (
  //         <Button onPress={pullNextPage} m='5px'>
  //           pull next page
  //         </Button>
  //       )}
  //       <Button onPress={reloadJobs} m='5px'>
  //         reload
  //       </Button>
  //       <Button onPress={() => setSortField('price')} m='5px'>
  //         sort by price
  //       </Button>
  //       <Button onPress={() => setSortField(undefined)} m='5px'>
  //         unsort
  //       </Button>
  //     </VStack>
  //   </BaseView>
  // </ScrollView>
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
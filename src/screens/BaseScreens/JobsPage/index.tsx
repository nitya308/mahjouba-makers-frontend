/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useCallback } from 'react';
import JobCard from 'components/JobCard';
import { Animated, StyleSheet, FlatList, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Text, VStack, Button, IconButton, Spinner, Spacer, Center } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { updateUser, userDataSelector } from 'redux/slices/userDataSlice';
import { jobsSelector } from 'redux/slices/jobsSlice';
import { Pressable, View } from 'react-native';
import { Job } from 'types/job';
import { useTranslation } from 'react-i18next';
import useAppDispatch from 'hooks/useAppDispatch';
import AudioIcon from '../../../assets/audio_icon.svg';
import { authSelector } from 'redux/slices/authSlice';
import { PartType } from 'types/part_type';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import AppStyles from 'styles/commonstyles';
import TextHighlighter from 'components/SpeechHighlighter';
import JobSearchPic from '../../../assets/job_search.svg';
import JobDetailsPage from '../JobDetailsPage';
import Colors from 'utils/Colors';
import MaterialSelector from 'components/MaterialSelector';
import { cleanUndefinedFields } from 'utils/requestUtils';
import SharpButton from 'components/SharpButton';

const JobsPage = ({
  pullNextPage,
  reloadJobs,
}: {
  pullNextPage: () => void;
  reloadJobs: () => void;
}) => {

  const { userData } = useAppSelector(userDataSelector);
  const { jobFeedIds, jobsMap, partsMap, materialsMap, loading } = useAppSelector(jobsSelector);
  const { t } = useTranslation();
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>();

  const [resultArray, setResultArray] = useState<{ job: Job, part: PartType }[]>([]);

  const calculateMatchingJobs = () => {
    const transformedArray = jobFeedIds.flatMap((jobId) => {
      const job = jobsMap[jobId];
      const part = partsMap[job.partTypeId];
      if (part?.materialIds && part?.materialIds.some(materialId => userData?.materialIds?.includes(materialId))) {
        return [{
          job,
          part,
        }];
      } else {
        return []; // Return an empty array for entries that don't match the condition
      }
    });

    setResultArray(transformedArray);
  };

  useEffect(() => {
    calculateMatchingJobs();
  }, [userData, materialsMap, jobFeedIds, jobsMap, partsMap]);

  const [scrollViewWidth, setScrollViewWidth] = React.useState(0);
  const boxWidth = scrollViewWidth * 0.7;
  const boxDistance = scrollViewWidth - boxWidth;
  const halfBoxDistance = boxDistance / 2;
  const pan = React.useRef(new Animated.ValueXY()).current;

  const renderItem = ({ item, index }: {
    item: {
      job: Job, part: PartType,
    }, index: number
  }) => (
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
      <View style={{ alignContent: 'center', alignItems: 'center' }}>
        <Pressable style={styles.jobCard} key={item.job._id} onPress={() => setSelectedJobId(item.job._id)}>
          <JobCard job={item.job} part={item.part} setSelectedJobId={setSelectedJobId} />
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderListEmpty = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>No Jobs Available with your Selected Materials</Text>
    </View>
  );

  const [pressed, setPressed] = useState(false);

  const [changeMaterials, setChangeMaterials] = useState(false);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>(userData?.materialIds ?? []);
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);

  const modalClose = useCallback(async () => {
    if (!selectedMaterialIds || !fbUserRef) return;
    try {
      dispatch(updateUser({
        updates: cleanUndefinedFields({
          materialIds: selectedMaterialIds,
        }),
        fbUserRef,
      }));
    } catch (err) {
      console.log(err);
    }
    setChangeMaterials(false);
  }, [userData, selectedMaterialIds]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <IconButton
          style={AppStyles.audioStyle}
          icon={<AudioIcon />}
          onPress={() => {
            setPressed(true);
          }}
        />

        <JobSearchPic width={ScreenWidth * .9} height={200} style={styles.topImageStyle} />

        <View style={{ paddingHorizontal: 20 }}>
          <Spacer size={10} />

          <TextHighlighter style={AppStyles.left_heading} text={t('Piece Selection')} pressed={pressed} setPressed={setPressed} />

          <Spacer size={5} />

          <TextHighlighter
            style={{ width: '70%' }}
            text={t('Choose a piece to make for the Mahjouba Motorcycle. Pieces are recommended to you based on location and your preferred materials.')}
            pressed={pressed} setPressed={setPressed} />

          <Pressable onPress={() => setChangeMaterials(true)}>
            <TextHighlighter
              style={{ color: Colors.highlight, fontWeight: 600 }}
              text={t('Change materials here.')}
              pressed={pressed} setPressed={setPressed} />
          </Pressable>

          <Spacer size={5} />

        </View>

        <VStack width="100%" alignItems='center' justifyContent='center'>
          <Modal isVisible={changeMaterials} backdropOpacity={0} style={styles.materialsModal}>
            <View style={{ height: '100%', padding: 40 }}>
              <VStack space={5} alignItems='center'>
                <Text style={AppStyles.center_heading}>Select Materials</Text>
                <ScrollView style={{ height: 350 }}>
                  <MaterialSelector
                    selectedMaterialIds={selectedMaterialIds}
                    setSelectedMaterialIds={setSelectedMaterialIds}
                  />
                </ScrollView>
                <SharpButton size='sm' onPress={modalClose}>
                  <Text style={AppStyles.buttonText}>Save</Text>
                </SharpButton>
              </VStack>
              <Spacer size={70} />
            </View>
          </Modal>

          <FlatList
            horizontal
            data={resultArray}
            style={{ height: 450, width: '100%' }}
            onEndReached={pullNextPage}
            contentContainerStyle={{ paddingVertical: 16 }}
            contentInsetAdjustmentBehavior="never"
            snapToAlignment="center"
            decelerationRate="fast"
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            snapToInterval={(boxWidth)}
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
        </VStack>
      </ScrollView>

      <Modal
        style={{ justifyContent: 'flex-end', margin: 0 }}
        backdropOpacity={0}
        isVisible={selectedJobId != undefined}>
        {selectedJobId &&
          <JobDetailsPage jobId={selectedJobId ?? ''} exit={() => setSelectedJobId(undefined)} />
        }
      </Modal>

    </SafeAreaView>

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
    flexShrink: 0,
    marginTop: 15,
    padding: 5,
  },
  plusSign: {
    fontSize: 18,
    color: '#080026',
  },
  modalContainer: {
    height: 300,
  },
  materialsModal: {
    marginTop: 120,
    marginBottom: 200,
    marginHorizontal: 20,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#F2F1EC',
    backgroundColor: 'white',
  },
  topImageStyle: {
    position: 'absolute',
    top: 0,
    right: -100,
  },

});

export default JobsPage;
import React, { useEffect, useState, useCallback } from 'react';
import { View, Image } from 'react-native';
import { Center, Text, IconButton, Spinner, ScrollView, HStack, VStack } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { Job } from 'types/job';
import { authSelector } from 'redux/slices/authSlice';
import { unacceptJob, jobsSelector } from 'redux/slices/jobsSlice';
import { PartType } from 'types/part_type';
import Placeholder from 'assets/no_image_placeholder.png';
import { StyleSheet } from 'react-native';
import Address from 'types/address';
import SharpButton from 'components/SharpButton';
import HammerIcon from '../../../assets/hammer2.svg';
import BaseView from 'components/BaseView';
import { fonts } from 'utils/constants';
import Colors from 'utils/Colors';
import AppModal from 'components/AddModal';
import AudioIcon from '../../../assets/audio_icon.svg';
import TimeRemainingIcon from '../../../assets/time-remaining.svg';
import CameraButton from 'components/CameraButton';
import MapPinIcon from '../../../assets/map_pin.svg';
import MADIcon from '../../../assets/MADIcon.png';
import AppStyles from 'styles/commonstyles';
import * as Speech from 'expo-speech';
import { useTranslation } from 'react-i18next';
import { Asset } from 'react-native-image-picker';
import useAppDispatch from 'hooks/useAppDispatch';
import { uploadMedia } from 'utils/mediaUtils';
import Photo from 'types/photo';
import { createPhoto } from 'redux/slices/photosSlice';
import { completeJob } from 'redux/slices/jobsSlice';
import i18next from 'i18next';
import { Dimensions } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export default function CurrentJobPage(
  { setDetailsPageOpen }: { setDetailsPageOpen: React.Dispatch<React.SetStateAction<any>> },
): JSX.Element {
  const { userData } = useAppSelector(userDataSelector);
  const fbUserRef = useAppSelector(authSelector).fbUserRef;
  const addressMap = useAppSelector((state) => state.addresses.addressMap);
  const photoMap = useAppSelector((state) => state.photos.photosMap);

  const { currentJobId, jobsMap, partsMap, materialsMap, loading } = useAppSelector(jobsSelector);
  const currentJob = jobsMap?.[currentJobId ?? ''];
  const currentPart = partsMap?.[currentJob?.partTypeId];
  const currentAddress = addressMap?.[currentJob?.dropoffAddressId];
  const { t } = useTranslation();
  const screenWidth = Dimensions.get('window').width;

  const currentDate = new Date();

  // const dueDate = new Date('2024-12-31T23:59:59'); //example date to test out countdown
  const dueDate = new Date(currentJob?.dueDate);
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());


  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  function calculateTimeRemaining() {
    const now = new Date();
    const difference = dueDate.getTime() - now.getTime();

    if (difference <= 0) {
      // Due date has passed
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  const [completeJobPhoto, setCompleteJobPhoto] = useState<Asset | undefined>();
  const [showModal, setShowModal] = useState(false);

  const dispatch = useAppDispatch();
  const imageUrl = photoMap?.[currentPart?.mainImageId]?.fullUrl;


  const saveNewJobPhoto = useCallback(async () => {
    if (!completeJobPhoto || !fbUserRef || !userData) return;
    try {
      const url = await uploadMedia(`${currentJob?._id}-${(new Date()).toLocaleString()}.jpeg`, completeJobPhoto?.uri ?? '');
      if (!url) throw new Error('Image upload failed');
      const newPhoto: Photo = {
        fullUrl: url,
        fileType: 'image/jpeg',
      };
      return await dispatch(createPhoto({ fbUserRef, newPhoto }))
        .unwrap()
        .then((res) => {
          return res?._id;
        });
    } catch (err) {
      console.log(err);
    }
  }, [userData, fbUserRef, completeJobPhoto]);

  const handleCompleteJobSubmit = useCallback(async () => {
    if (!currentJob || !fbUserRef || !userData) return;
    try {
      const imageId = await saveNewJobPhoto();
      if (imageId) {
        dispatch(completeJob({
          jobId: currentJob?._id,
          fbUserRef,
          imageId: imageId,
        }));
      } else {
        alert('Either no image selected, or issue with image upload');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setShowModal(false);
      setCompleteJobPhoto(undefined);
    }
  }, [completeJobPhoto, setCompleteJobPhoto, fbUserRef, userData, currentJob, setShowModal, setCompleteJobPhoto]);

  if (loading) {
    return (
      <BaseView>
        <Center>
          <Spinner />
        </Center>
      </BaseView>
    );
  }

  return (
    <ScrollView>
      <VStack width="100%" mt='20px' alignItems='flex-start'>
        {currentJob ? (
          <BaseView>
            <View>
              <View style={styles.detailsHeader}>
                <Text style={styles.name}>Job Details</Text>
              </View>
              <View style={styles.jobDetails}>
                <Text style={styles.text}>{currentPart?.name}</Text>
              </View>
              <View style={styles.jobDetails}>
                <Text style={styles.timeRemainingText}>Time Remaining:</Text>
              </View>
              <View>
                <View style={styles.jobDetails}>
                  <Text style={styles.timeRemainingText}>{`${timeRemaining.days} days ${timeRemaining.hours} hours ${timeRemaining.minutes} minutes`}</Text>
                </View>
              </View>
              <Center>
                <View>
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.image} // Adjust the width and height as needed
                    />
                  ) : (
                    <View>
                      {/* Placeholder or fallback UI if image URL is not available */}
                    </View>
                  )}
                  <Text>Instruction Images:</Text>
                  {
                    currentPart?.instructionImageIds.map((instructionImageId) => {
                      const instructionImageUrl = photoMap?.[instructionImageId]?.fullUrl;
                      return (
                        <View>
                          {instructionImageUrl ? (
                            <Image
                              source={{ uri: instructionImageUrl }}
                              style={styles.image} // Adjust the width and height as needed
                            />
                          ) : (
                            <View>
                              {/* Placeholder or fallback UI if image URL is not available */}
                            </View>
                          )}
                        </View>
                      );
                    })
                  }
                </View>
              </Center>
            </View>
            <Center marginTop={'10px'}>
              <AppModal
                showModal={showModal}
                setShowModal={setShowModal}
                modalButton={
                  <SharpButton
                    width={'200px'}
                    backgroundColor={Colors.yellow}
                    my='2px'
                    size='sm'
                    onPress={() => {
                      setShowModal(true);
                    }}
                  >
                    <Text fontFamily={fonts.regular}>
                      Complete Job
                    </Text>
                  </SharpButton>
                }
                backgroundColor={Colors.white}
                closeButton={true}
              >
                <HStack alignItems={'center'}>
                  <Text fontStyle={fonts.regular} marginTop={'20px'} maxWidth={'220px'}>
                    Please upload at least 1 image of the completed part.
                  </Text>
                </HStack>
                <Center marginTop={'10px'}>
                  <CameraButton
                    selectedImageAsset={completeJobPhoto}
                    setSelectedImageAsset={setCompleteJobPhoto}
                  />
                </Center>
                <Center marginTop={'10px'}>
                  <SharpButton
                    width={'90px'}
                    backgroundColor={Colors.yellow}
                    my='2px'
                    size='sm'
                    onPress={handleCompleteJobSubmit}
                    marginTop={'10px'}
                  >
                    <Text fontFamily={fonts.regular}>
                      Finalize
                    </Text>
                  </SharpButton>
                </Center>
              </AppModal>
            </Center>
            <Center marginTop={'10px'}>
              <SharpButton
                width={'200px'}
                backgroundColor={Colors.white}
                borderRadius={'24px'}
                borderColor={Colors.black}
                borderWidth={'.5'}
                my='2px'
                size='sm'
                onPress={() => {
                  dispatch(unacceptJob({ jobId: currentJobId ?? '', fbUserRef }));
                  setDetailsPageOpen(false);
                }}
                marginBottom={'10px'}
              >
                <Text fontFamily={fonts.regular}>
                  Unaccept Job
                </Text>
              </SharpButton>
            </Center>
          </BaseView>
        )
          :
          <BaseView>
            <Center
              marginTop={'100px'}
            >
              <Text>
                You haven't accepted a job yet
              </Text>
            </Center>
          </BaseView>
        }
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailsHeader: {
    flexDirection: 'row',
    width: ScreenWidth,
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginBottom: 10,
    marginTop: 50,
  },
  materialContainer: {
    width: '90%',
    alignSelf: 'center',
    borderColor: '#000000',
    marginBottom: 15,
    padding: 10,
  },
  jobDetails: {
    marginLeft: 30,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    color: 'white',
  },
  textAndIcon: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  image: {
    width: 315,
    height: 315,
    borderRadius: 10,
  },
  name: {
    marginLeft: 15,
    fontSize: 35,
    lineHeight: 40,
  },
  timeRemainingText: {
    fontSize: 20,
    lineHeight: 24,
  },
  text: {
    lineHeight: 25,
    paddingTop: 20,
    fontSize: 30,
    maxWidth: '90%',
  },
  button: {
    marginTop: 10,
  },
  audioIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
  },
  buttonAudioIcon: {
    position: 'absolute',
    right: -70,
  },
});
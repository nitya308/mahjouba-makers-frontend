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
            {currentPart?.imageIds.length
              ? <Image alt='part' source={{ uri: photoMap?.[currentPart?.imageIds[0]]?.fullUrl ?? '' }} style={styles.image} />
              : <Image alt='placeholder' source={Placeholder} style={styles.image} />}
            <View>
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{currentPart?.name}</Text>
                <Text>{`Current Date: ${currentDate.toDateString()}`}</Text>
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.timeRemaining}>
                  <TimeRemainingIcon />
                  <Text style={styles.timeRemainingText}>{`${timeRemaining.days} days ${timeRemaining.hours} hours remaining`}</Text>
                </View>
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.infoBody}>
                  <View style={styles.textAndIcon}>
                    <MapPinIcon width={28} height={28} />
                    <Text style={[styles.text, { maxWidth: '90%' }]}>{currentAddress?.description}</Text>
                  </View>
                  <View style={styles.textAndIcon}>
                    <Image alt='MAD icon' source={MADIcon} />
                    <Text style={styles.text}>{`${currentJob?.price} MAD`}</Text>
                  </View>
                </View>
              
                <IconButton
                  style={styles.audioIcon}
                  icon={<AudioIcon />}
                  onPress={() => {
                    const toSpeak = t(currentPart?.name + ',') +
                  t('has') + `${currentPart?.completionTime}` + t('hours remaining')
                  + t('ship to address') + currentAddress?.description
                  + ',' + t('for price') + `${currentJob?.price}` + t('MAD');
                    Speech.speak(t(toSpeak), { language: i18next.language });
                  }}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.materialContainer}>
                {currentPart?.materialIds?.map((materialId, index) => (
                  <View key={index}>
                    <Text style={styles.text}>{materialsMap?.[materialId]?.name ?? ''}</Text>
                  </View>
                ))}
                <IconButton
                  style={styles.audioIcon}
                  icon={<AudioIcon />}
                  onPress={() => {
                    const materialsString = currentPart?.materialIds
                      .map((materialId) => t(materialsMap?.[materialId]?.name) ?? '')
                      .join(', ');
                    Speech.speak(materialsString, { language: i18next.language });
                  }}
                />
              </View>
            </View>
            <Center marginTop={'10px'}>
              <SharpButton
                width={'200px'}
                backgroundColor={Colors.yellow}
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
              <IconButton
                style={styles.buttonAudioIcon}
                icon={<AudioIcon />}
                onPress={() => {
                  Speech.speak(t('Unaccept Job'), { language: i18next.language });
                }}
              />
            </Center>
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
                  <IconButton
                    icon={<AudioIcon />}
                    onPress={() => {
                      Speech.speak(t('My Profile'), { language: i18next.language });
                    }}
                  />
                </HStack>
                <Center marginTop={'10px'}>
                  <CameraButton
                    selectedImageAsset={completeJobPhoto}
                    setSelectedImageAsset={setCompleteJobPhoto}
                  />
                </Center>
                <Center marginTop={'10px'}>
                  <SharpButton
                    width={'80px'}
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
              <IconButton
                style={styles.buttonAudioIcon}
                icon={<AudioIcon />}
                onPress={() => {
                  Speech.speak(t('Complete Job'), { language: i18next.language });
                }}
              />
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
  infoContainer: {
    width: ScreenWidth,
    borderColor: Colors.yellow,
    borderWidth: 1,
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginBottom: 10,
  },
  materialContainer: {
    width: '90%',
    alignSelf: 'auto',
    borderColor: '#000000',
    borderWidth: 1,
    marginBottom: 15,
  },
  timeRemaining: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    color: 'white',
    borderBottomWidth: 1,
  },
  textAndIcon: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  image: {
    marginTop: 20,
    height: '50%',
    width: '50%',
    marginBottom: 20,
  },
  name: {
    marginLeft: 15,
    color: 'white',
    fontSize: 40,
    lineHeight: 40,
  },
  timeRemainingText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 24,
  },
  text: {
    lineHeight: 25,
    fontSize: 20,
    maxWidth: '90%',
    color: 'white',
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
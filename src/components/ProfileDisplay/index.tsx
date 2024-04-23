import React, { useCallback, useEffect, useState } from 'react';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { StyleSheet } from 'react-native';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { Box, HStack, IconButton, ScrollView, View, Pressable, VStack, Spacer } from 'native-base';
import { Image as ExpoImage } from 'expo-image';
import { DEFAULT_PROFILE_URI } from 'utils/constants';
import { authSelector } from 'redux/slices/authSlice';
import AudioIcon from '../../assets/audio_icon.svg';
import { useTranslation } from 'react-i18next';
import MapPinIcon from '../../assets/map_pin.svg';
import { jobsSelector, getUserJobHistory } from 'redux/slices/jobsSlice';
import MaterialChip from '../MaterialChip';
import Colors from 'utils/Colors';
import { SafeAreaView, RefreshControl } from 'react-native';
import AppStyles from 'styles/commonstyles';
import TextHighlighter from 'components/SpeechHighlighter';
import JobHistoryCard from 'components/JobHistoryCard';
import { SvgXml } from 'react-native-svg';

export default function ProfileDisplay({
  toggleEditing,
  toggleSettingsOpen,
}: {
  toggleEditing: () => void;
  toggleSettingsOpen: () => void;
}): JSX.Element {
  const dispatch = useAppDispatch();

  const { fbUserRef } = useAppSelector(authSelector);
  const { userData } = useAppSelector(userDataSelector);
  const { jobsMap, partsMap, materialsMap, jobHistoryIds } = useAppSelector(jobsSelector);
  console.log('jobhistoryids', jobHistoryIds);
  const addressMap = useAppSelector((state) => state.addresses.addressMap);
  const photoMap = useAppSelector((state) => state.photos.photosMap);
  const { t } = useTranslation();


  const [refreshing, setRefreshing] = useState(false);
  
  const reloadJobHistory = useCallback(async () => {
    if (!fbUserRef) return;
    setRefreshing(true);
    await dispatch(getUserJobHistory({ fbUserRef }));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [fbUserRef, dispatch]);

  useEffect(() => {
    reloadJobHistory();
  }, [fbUserRef, reloadJobHistory]);

  const [pressed, setPressed] = useState(false);
  // if (userData?.homeAddressId) {
  //   console.log('userData', addressMap[userData?.homeAddressId].city);
  // }

  return (
    <SafeAreaView>
      <IconButton
        icon={<AudioIcon />}
        onPress={() => {
          setPressed(true);
        }}
        style={AppStyles.audioStyle}
      />
      <View>
        <View style={styles.profileRow}>
          <VStack space={2}>
            <ExpoImage
              source={{
                uri: photoMap?.[userData?.profilePicId ?? '']?.fullUrl ?? DEFAULT_PROFILE_URI,
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 100,
                borderWidth: 3,
                borderColor: Colors.beige,
              }}
            />
            {userData?.name &&
              <TextHighlighter style={AppStyles.center_heading} text={userData.name} pressed={pressed} setPressed={setPressed} />
            }
          </VStack>
          {userData?.qrCode &&
            <SvgXml xml={userData?.qrCode} width="50%" height="100%" />
          }
        </View>
        <View style={styles.profileDetailsRow}>
          <HStack space={1}>
            <MapPinIcon />
            {
              userData?.homeAddressId &&
              <TextHighlighter style={AppStyles.bodyText} text={t(addressMap[userData?.homeAddressId].city)} pressed={pressed} setPressed={setPressed} />
            }
          </HStack>
          <HStack space={1}>
            <MapPinIcon />
            {
              userData?.language &&
              <TextHighlighter style={AppStyles.bodyText} text={t(userData?.language)} pressed={pressed} setPressed={setPressed} />
            }
          </HStack>
          <HStack space={1}>
            <MapPinIcon />
            {
              jobHistoryIds &&
              <TextHighlighter style={AppStyles.bodyText} text={t(jobHistoryIds.length.toString() + ' jobs')} pressed={pressed} setPressed={setPressed} />
            }
          </HStack>
        </View>
        <Spacer size={5} />
        <TextHighlighter style={AppStyles.center_heading} text={t('Past Projects')} pressed={pressed} setPressed={setPressed} />
      </View>
      <ScrollView style={styles.jobHistoryScroll} contentContainerStyle={{ flexGrow : 1, alignItems: 'center' }} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={reloadJobHistory} />} >
        {jobHistoryIds.map((jobId: string) => {
          const job = jobsMap[jobId];
          const part = partsMap[job.partTypeId];
          const materials = part?.materialIds?.map((materialId: string) => {
            const material = materialsMap[materialId];
            return material ? material.name : ''; // Return the name if available, otherwise an empty string
          });
          return (
            <Pressable
              marginBottom={'15px'}
              marginTop={'15px'}
              key={job._id}
              onPress={() => console.log('TODO')}
            >
              <JobHistoryCard job={job} part={part} materials={materials} pressed={pressed} setPressed={setPressed} />
            </Pressable>
          );
        })}
      </ScrollView>


      {/* <HStack alignItems={'center'}>
        <TextHighlighter style={AppStyles.center_heading} text={t('My Profile')} pressed={pressed} setPressed={setPressed} />
      </HStack>
      <IconButton
        icon={<AudioIcon />}
        onPress={() => {
          setPressed(true);
        }}
      />


      <ScrollView
        width={'100%'}
        marginBottom={'180px'}
      >
        <VStack space={2} alignItems='center' marginTop={10}>

          {
            addressString &&
            <HStack marginBottom={'10px'} space={2}>
              <MapPinIcon />
              <TextHighlighter style={{ maxWidth: '100%' }} text={t(addressString)} pressed={pressed} setPressed={setPressed} />
            </HStack>
          }
          <HStack space={2}>
            {
              userData?.materialIds?.map((materialId: string) => {
                const material = materialsMap[materialId];
                if (material) {
                  return <MaterialChip materialName={material?.name} />;
                }
                return <></>;
              })
            }
          </HStack>
          <Box
            height={0.2}
            width="100%"
            backgroundColor={Colors.beige}
            marginTop={5}
            marginBottom={5}
          />
          <TextHighlighter style={AppStyles.center_heading} text={t('Past Projects')} pressed={pressed} setPressed={setPressed} />
          {jobHistoryIds.map((jobId: string) => {
            const job = jobsMap[jobId];
            const part = partsMap[job.partTypeId];
            const materials = part?.materialIds?.map((materialId: string) => {
              const material = materialsMap[materialId];
              return material ? material.name : ''; // Return the name if available, otherwise an empty string
            });
            return (
              <Pressable
                marginBottom={'15px'}
                marginTop={'15px'}
                key={job._id}
                onPress={() => console.log('TODO')}
              >
                <JobHistoryCard job={job} part={part} materials={materials} />
              </Pressable>
            );
          })}
        </VStack>
      </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    paddingTop: 50,
    flexDirection: 'row',
    gap: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetailsRow: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobHistoryScroll:{
    paddingHorizontal: 20,
    height: 'fit-content',
  },
});
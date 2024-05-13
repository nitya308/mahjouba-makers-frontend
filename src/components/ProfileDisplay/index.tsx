import React, { useCallback, useEffect, useState } from 'react';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { StyleSheet } from 'react-native';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { HStack, IconButton, ScrollView, View, Pressable, VStack, Spacer } from 'native-base';
import { Image as ExpoImage } from 'expo-image';
import { DEFAULT_PROFILE_URI } from 'utils/constants';
import { authSelector } from 'redux/slices/authSlice';
import AudioIcon from '../../assets/audio_icon.svg';
import StopIcon from '../../assets/hand_icon.svg';
import * as Speech from 'expo-speech';
import SettingsIcon from '../../assets/settings_icon.svg';
import { useTranslation } from 'react-i18next';
import MapPinIcon from '../../assets/map_pin.svg';
import { jobsSelector, getUserJobHistory } from 'redux/slices/jobsSlice';
import Colors from 'utils/Colors';
import { SafeAreaView, RefreshControl } from 'react-native';
import AppStyles from 'styles/commonstyles';
import TextHighlighter from 'components/SpeechHighlighter';
import JobHistoryCard from 'components/JobHistoryCard';
import { SvgXml } from 'react-native-svg';

export default function ProfileDisplay({
  toggleEditing,
}: {
  toggleEditing: () => void;
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

  return (
    <SafeAreaView>
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
            <SvgXml xml={userData?.qrCode} width="40%" height="90%" />
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
        <TextHighlighter style={{ ...AppStyles.center_heading, ...AppStyles.underline }} text={t('Past Projects')} pressed={pressed} setPressed={setPressed} />
      </View>
      <ScrollView style={styles.jobHistoryScroll} contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={reloadJobHistory} />}
      >
        {jobHistoryIds.map((jobId: string) => {
          const job = jobsMap[jobId];
          const part = partsMap[job.partTypeId];
          const materials = part?.materialIds?.map((materialId: string) => {
            const material = materialsMap[materialId];
            return material ? material.name : ''; // Return the name if available, otherwise an empty string
          });
          return (
            <Pressable
              marginTop={'15px'}
              key={job._id}
              onPress={() => console.log('TODO')}
              width={'90%'}
            >
              <JobHistoryCard job={job} part={part} materials={materials} pressed={pressed} setPressed={setPressed} />
            </Pressable>
          );
        })}
        <Spacer size={400} />
      </ScrollView>
      <IconButton
        icon={!pressed ? <AudioIcon /> : <StopIcon/>}
        onPress={() => {
          if (pressed) {
            Speech.stop();
            setPressed(false);
          } else {
            setPressed(true);
          }
        }}
        style={AppStyles.audioButtonStyle}
      />
      <IconButton
        icon={<SettingsIcon />}
        onPress={toggleEditing}
        style={styles.settingsStyle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    paddingTop: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileDetailsRow: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobHistoryScroll: {
    paddingHorizontal: 20,
    height: '100%',
  },
  settingsStyle: {
    position: 'absolute',
    right: 10,
    top: 45,
  },
});
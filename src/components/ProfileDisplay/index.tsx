import React, { useEffect, useState } from 'react';
import { userDataSelector } from 'redux/slices/userDataSlice';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { Box, HStack, Spacer, IconButton, Icon, Button, Center, Text, Heading, ScrollView, View, Pressable, VStack } from 'native-base';
import { Image as ExpoImage } from 'expo-image';
import { AntDesign } from '@expo/vector-icons';
import { DEFAULT_PROFILE_URI } from 'utils/constants';
import { authSelector } from 'redux/slices/authSlice';
import { fonts } from 'utils/constants';
import AudioIcon from '../../assets/audio_icon.svg';
import { useTranslation } from 'react-i18next';
import EditIcon from '../../assets/edit_icon.svg';
import MapPinIcon from '../../assets/map_pin.svg';
import addressApi from 'requests/addressApi';
import { jobsSelector, getUserJobHistory } from 'redux/slices/jobsSlice';
import MaterialChip from '../MaterialChip';
import Colors from 'utils/Colors';
import { Job } from 'types/job';
import JobCard from 'components/JobCard';
import * as Speech from 'expo-speech';
import { getAddress } from 'redux/slices/addressSlice';
import i18next from 'i18next';
import { SafeAreaView } from 'react-native';
import AppStyles from 'styles/commonstyles';
import TextHighlighter from 'components/SpeechHighlighter';
import JobHistoryCard from 'components/JobHistoryCard';

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

  const addressString = addressMap?.[userData?.homeAddressId ?? '']?.description ?? '';

  useEffect(() => {
    if (fbUserRef) {
      dispatch(getUserJobHistory({
        fbUserRef,
      }));
    }
  }, [fbUserRef]);

  const [pressed, setPressed] = useState(false);
  console.log('userData', userData?.qrCode);

  return (
    <SafeAreaView>
      <HStack justifyContent={'space-between'}>
        <IconButton
          icon={<EditIcon />}
          onPress={toggleEditing}
        />
        <HStack alignItems={'center'}>
          <TextHighlighter style={AppStyles.center_heading} text={t('My Profile')} pressed={pressed} setPressed={setPressed} />
        </HStack>
        <IconButton
          icon={<AudioIcon />}
          onPress={() => {
            setPressed(true);
          }}
        />
      </HStack>

      <ScrollView
        width={'100%'}
        marginBottom={'180px'}
      >
        <VStack space={2} alignItems='center' marginTop={10}>
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
                <JobHistoryCard job={job} part={part} materials={materials}/>
              </Pressable>
            );
          })}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
import React, { useEffect, useState } from 'react';
import { userDataSelector } from 'redux/slices/userDataSlice';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { Box, HStack, IconButton, ScrollView, Pressable, VStack, Spacer } from 'native-base';
import { Image as ExpoImage } from 'expo-image';
import { DEFAULT_PROFILE_URI } from 'utils/constants';
import { authSelector } from 'redux/slices/authSlice';
import AudioIcon from '../../assets/audio_icon.svg';
import { useTranslation } from 'react-i18next';
import EditIcon from '../../assets/edit_icon.svg';
import MapPinIcon from '../../assets/map_pin.svg';
import { jobsSelector, getUserJobHistory } from 'redux/slices/jobsSlice';
import MaterialChip from '../MaterialChip';
import Colors from 'utils/Colors';
import { SafeAreaView, View } from 'react-native';
import AppStyles from 'styles/commonstyles';
import TextHighlighter from 'components/SpeechHighlighter';
import JobHistoryCard from 'components/JobHistoryCard';

export default function PendingDelivery(): JSX.Element {

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

  return (
    <View>

      <View style={{ paddingHorizontal: 20 }}>
        <Spacer size={10} />
        <TextHighlighter style={AppStyles.left_heading} text={t('Pending for Delivery')} pressed={pressed} setPressed={setPressed} />
        <Spacer size={5} />
      </View>

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
    </View >
  );
}
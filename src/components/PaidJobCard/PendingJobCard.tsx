import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, Image, IconButton, HStack, VStack } from 'native-base';
import { StyleSheet } from 'react-native';
import useAppSelector from 'hooks/useAppSelector';
import { JOB_STATUS_ENUM, Job } from 'types/job';
import { PartType } from 'types/part_type';
import Placeholder from 'assets/no_image_placeholder.png';
import AudioIcon from '../../assets/audio_icon.svg';
import HammerIcon from '../../assets/hammer2.svg';
import Money1 from '../../assets/money1.svg';
import * as Speech from 'expo-speech';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements';
import TextHighlighter from 'components/SpeechHighlighter';
import AppStyles from 'styles/commonstyles';
import Colors from 'utils/Colors';
import SharpButton from 'components/SharpButton';


const PendingJobCard = (
  { job, part, pressed, setPressed }:
  { job: Job, part: PartType, materials: string[], pressed: boolean, setPressed: React.Dispatch<React.SetStateAction<boolean>> },
) => {

  const { t } = useTranslation();
  const photoMap = useAppSelector((state) => state.photos.photosMap);
  const daysLeft = useMemo(() => {
    // TODO: this needs to be from approval date
    if (job?.completionDate) {
      const completionDate = new Date(job.completionDate);
      const currentDate = new Date();
      const timeDiff = Math.abs(currentDate.getTime() - completionDate.getTime());
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return 30 - daysDiff;
    }
    return null;
  }, [job?.completionDate]);

  // Display different image depending on current jobStatus
  const imageUrl = (job?.jobStatus === JOB_STATUS_ENUM.COMPLETE || job?.jobStatus === JOB_STATUS_ENUM.PENDING_REVIEW)
    ? (photoMap?.[job?.imageIds[0]]?.fullUrl)
    : (photoMap?.[part?.imageIds[0]]?.fullUrl);

  const completionDate = job?.completionDate ? new Date(job.completionDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) : null;

  return (
    <View style={styles.jobCardContainer}>
      <View style={AppStyles.rowFlexStart}>

        {part?.imageIds?.length
          ? <Image source={{ uri: imageUrl }} style={styles.image} alt="part image" />
          : <Image source={Placeholder} style={styles.image} alt="image not found" />
        }

        <VStack space={1} padding={2} style={{ flexGrow: 1 }}>
          <View style={AppStyles.row}>
            <TextHighlighter style={AppStyles.bodyTextLg} text={t(part?.name)} pressed={pressed} setPressed={setPressed} />
            <TextHighlighter style={AppStyles.bodyTextMd} text={t(job?.price?.toString() + ' ' + 'MAD')} pressed={pressed} setPressed={setPressed} />
          </View>
          
          {completionDate && (
            <TextHighlighter style={styles.completionDate} text={t('Completed' + ' ' + completionDate)} pressed={pressed} setPressed={setPressed} />
          )}
          {job?.jobStatus === JOB_STATUS_ENUM.COMPLETE &&
            daysLeft && daysLeft > 0 ?
            
            <HStack justifyContent='flex-end' alignItems='center' space={2}>
              <TextHighlighter style={styles.timeLeft} text={t(daysLeft + ' days left to:')} pressed={pressed} setPressed={setPressed} />
              <SharpButton >
                <TextHighlighter style={AppStyles.buttonText} text={t('Collect')} pressed={pressed} setPressed={setPressed} />
              </SharpButton>
            </HStack>
            :
            <Text>{daysLeft}</Text>
            // <TextHighlighter style={styles.timeLeft} text={t('Collection date expired')} pressed={pressed} setPressed={setPressed} />
          }
        </VStack>

      </View>
      <View>

      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  jobCardContainer: {
    borderWidth: 2,
    borderColor: '#F2F1EC',
  },
  completionDate: {
    fontSize: 18,
    color: Colors.darkGray,
  },
  image: {
    height: 65,
    minWidth: 65,
  },
  cardContent: {
    padding: 10,
  },
  timeLeft:
  {
    color: 'red',
    fontSize: 18,
  },
});

export default PendingJobCard;
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, Image, IconButton, HStack } from 'native-base';
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


const JobHistoryCard = (
  { job, part, pressed, setPressed }:
  { job: Job, part: PartType, materials: string[], pressed: boolean, setPressed: React.Dispatch<React.SetStateAction<boolean>> },
) => {

  const { t } = useTranslation();

  const photoMap = useAppSelector((state) => state.photos.photosMap);

  // Display different image depending on current jobStatus
  const imageUrl = (job?.jobStatus === JOB_STATUS_ENUM.COMPLETE || job?.jobStatus === JOB_STATUS_ENUM.PENDING_REVIEW)
    ? (photoMap?.[job?.imageIds[0]]?.fullUrl)
    : (photoMap?.[part?.mainImageId]?.fullUrl);

  const [completionDate, setCompletionDate] = useState<string | null>(null);

  useEffect(() => {
    // if (!job?.completionDate) return;
    // const temp = new Date(job.completionDate);
    // console.log('date', temp.getFullYear(), temp.getMonth(), temp.getDate());
    setCompletionDate(job?.completionDate ? new Date(job.completionDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) : null);
  }, [job.completionDate]);


  return (
    <View style={styles.jobCardContainer}>
      <View>
        {imageUrl && imageUrl !== ''
          ? <Image source={{ uri: imageUrl }} style={styles.image} alt="part image" />
          : <Image source={Placeholder} style={styles.image} alt="image not found" />
        }
      </View>
      <HStack justifyContent="space-between" style={styles.cardContent} alignItems='center'>
        <TextHighlighter style={AppStyles.bodyTextLg} text={t(part?.name)} pressed={pressed} setPressed={setPressed} />
        <TextHighlighter style={AppStyles.bodyTextMd} text={t(job?.price?.toString() + ' ' + 'MAD')} pressed={pressed} setPressed={setPressed} />
      </HStack>
      {completionDate && (
        <TextHighlighter style={styles.completionDate} text={t('Completed' + ' ' + completionDate)} pressed={pressed} setPressed={setPressed} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  jobCardContainer: {
    backgroundColor: '#F2F1EC',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#F2F1EC',
  },
  completionDate: {
    fontSize: 18,
    color: Colors.darkGray,
    textAlign: 'right',
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  image: {
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 10,
  },
});

export default JobHistoryCard;
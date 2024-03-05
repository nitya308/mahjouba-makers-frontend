import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, Image, IconButton } from 'native-base';
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


const JobHistoryCard = ({ job, part, materials }: { job: Job, part: PartType, materials: string[] }) => {

  const { t } = useTranslation();

  const photoMap = useAppSelector((state) => state.photos.photosMap);
  const [pressed, setPressed] = useState(false);

  // Display different image depending on current jobStatus
  const imageUrl = (job?.jobStatus === JOB_STATUS_ENUM.COMPLETE || job?.jobStatus === JOB_STATUS_ENUM.PENDING_REVIEW)
    ? (photoMap?.[job?.imageIds[0]]?.fullUrl)
    : (photoMap?.[part?.imageIds[0]]?.fullUrl);

  return (
    <View style={styles.jobCardContainer}>
      <View style={styles.imageWrapper}>
        {part?.imageIds?.length
          ? <Image source={{ uri: imageUrl }} style={styles.image} alt="part image" />
          : <Image source={Placeholder} style={styles.image} alt="image not found" />
        }
      </View>
      <View style={styles.cardContent}>
        <IconButton
          style={AppStyles.audioStyle}
          icon={<AudioIcon />}
          onPress={() => {
            setPressed(true);
          }}
        />
        <View style={styles.namePriceContainer}>
          <TextHighlighter style={styles.name} text={t(part?.name)} pressed={pressed} setPressed={setPressed} />
        </View>
        {materials && materials?.length > 0 && (
          <View style={styles.materialContainer}>
            <HammerIcon />
            {materials.map((material, index) => (
              <View key={material}>
                {index < materials.length - 1 &&
                  <TextHighlighter style={styles.materialChip} text={t(material + ',')} pressed={pressed} setPressed={setPressed} />
                }
                {index == materials.length - 1 &&
                  <TextHighlighter style={styles.materialChip} text={t(material)} pressed={pressed} setPressed={setPressed} />
                }
              </View>
            ))}
          </View>
        )}
        <View style={styles.materialContainer}>
          <Money1 />
          <TextHighlighter style={styles.price} text={t(job?.price?.toString())} pressed={pressed} setPressed={setPressed} />
        </View>
        {job?.completionDate && (
          <Text style={styles.completionDate}>
            Completed {new Date(job.completionDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  jobCardContainer: {
    backgroundColor: '#333333', //weird error with: #ffffff1a
    borderWidth: 1,
    borderColor: '#FFC01D',
    borderRadius: 0,
    marginBottom: 10,
    width: 300,
  },
  completionDate: {
    fontSize: 18,
    color: '#00FF00',
    textAlign: 'right',
  },
  image: {
    height: 150,
  },
  imageWrapper: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  materialContainer: {
    paddingTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  materialChip: {
    fontSize: 20,
    color: 'white',
  },
  cardContent: {
    padding: 10,
  },
  namePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  price: {
    fontSize: 20,
    color: 'white',
  },
  audioIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
});

export default JobHistoryCard;
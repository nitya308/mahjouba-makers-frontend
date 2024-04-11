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
import SharpButton from 'components/SharpButton';


const JobCard = ({ job, part, handleSelect }: { job: Job, part: PartType, handleSelect: (job?: Job) => void; }) => {

  const { t } = useTranslation();

  const photoMap = useAppSelector((state) => state.photos.photosMap);
  const imageUrl = photoMap?.[part?.imageIds[0]]?.fullUrl;

  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.jobCardContainer}>

      <IconButton
        style={AppStyles.audioStyle}
        icon={<AudioIcon />}
        onPress={() => {
          setPressed(true);
        }}
      />

      <TextHighlighter style={styles.name} text={t(part?.name)} pressed={pressed} setPressed={setPressed} />

      <View style={styles.imageWrapper}>
        {part?.imageIds?.length
          ? <Image source={{ uri: imageUrl }} style={styles.image} alt="part image" />
          : <Image source={Placeholder} style={styles.image} alt="image not found" />
        }
      </View>

      <View style={[AppStyles.row, { marginHorizontal: 10 }]}>
        <TextHighlighter style={styles.price} text={t(job?.price?.toString() + ' MAD')} pressed={pressed} setPressed={setPressed} />
        <SharpButton my='10px'
          size='sm' onPress={() => handleSelect(job)}>
          <TextHighlighter style={AppStyles.buttonText} text={t('View')} pressed={pressed} setPressed={setPressed} />
        </SharpButton>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  jobCardContainer: {
    borderRadius: 10,
    // shadowColor: '#3A3449',
    // shadowOpacity: 0.15,
    // shadowRadius: 1,
    borderWidth: 2,
    borderColor: '#F2F1EC',

  },
  name: {
    padding: 10,
    fontSize: 30,
  },
  completionDate: {
    fontSize: 18,
    textAlign: 'right',
  },
  image: {
    height: 400 / 2,
    borderTopRightRadius: 8,
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
  },
  cardContent: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 40,
  },
  namePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  price: {
    fontSize: 20,
  },
  audioIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
});

export default JobCard;
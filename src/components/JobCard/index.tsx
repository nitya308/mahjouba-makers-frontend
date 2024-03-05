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


const JobCard = ({ job, part, materials }: { job: Job, part: PartType, materials: string[] }) => {

  const { t } = useTranslation();

  const photoMap = useAppSelector((state) => state.photos.photosMap);

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
        <View style={styles.namePriceContainer}>
          <Text style={styles.name}>{part?.name}</Text>
        </View>
        
        <View>
          {
            // TODO: TBH we probably should be displaying jobId, it's hard to distinguish between jobs
            // just off of the part name - Eric
          }
        </View>
        
        {materials && materials?.length > 0 && (
          <View style={styles.materialContainer}>
            <HammerIcon/>
            {materials.map((material, index) => (
              <View key={material}>
                <Text style={styles.materialChip}>
                  {material}
                  {index < materials.length - 1 && ','}
                </Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Money1/>
          <Text style={styles.price}>{job?.price}</Text>
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
    borderRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 10,
    shadowColor: '#FFC01D',
    shadowOpacity: 1,
    shadowOffset: { width: -17, height: 0 },
    paddingBottom: 70,
  },
  completionDate: {
    fontSize: 18,
    color: '#00FF00',
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
    paddingTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  materialChip: {
    fontSize: 20,
    color: 'white',
  },
  cardContent: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 40, 
    paddingBottom: 40,
  },
  namePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
  },
  name: {
    paddingTop: 20,
    fontSize: 30,
    color: '#FFFFFF',
  },
  price: {
    paddingTop: 20,
    fontSize: 20,
    color: 'white',
  },
  audioIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
});

export default JobCard;
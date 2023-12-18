import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, Image } from 'native-base';
import { StyleSheet } from 'react-native';
import useAppSelector from 'hooks/useAppSelector';
import { JOB_STATUS_ENUM, Job } from 'types/job';
import { PartType } from 'types/part_type';
import Placeholder from 'assets/no_image_placeholder.png';

const JobCard = ({ job, part, materials }: { job: Job, part: PartType, materials: string[] }) => {
  const photoMap = useAppSelector((state) => state.photos.photosMap);

  // Display different image depending on current jobStatus
  const imageUrl = (job?.jobStatus === JOB_STATUS_ENUM.COMPLETE || job?.jobStatus === JOB_STATUS_ENUM.PENDING_REVIEW) 
    ? (photoMap?.[job?.imageIds[0]]?.fullUrl) 
    : (photoMap?.[part?.imageIds[0]]?.fullUrl);

  return (
    <View style={styles.jobCardContainer}>
      <View style={styles.imageWrapper}>
        { part?.imageIds?.length 
          ? <Image source={{ uri: imageUrl }} style={styles.image} />
          : <Image source={Placeholder} style={styles.image} /> 
        }
      </View>
      <View style={styles.cardContent}>
        <View style={styles.namePriceContainer}>
          <Text style={styles.name}>{part?.name}</Text>
          <Text style={styles.price}>{job?.price} MAD</Text>
        </View>
        <View>
          {
            // TODO: TBH we probably should be displaying jobId, it's hard to distinguish between jobs
            // just off of the part name - Eric
          }
          <Text>{job._id}</Text>
        </View>
        { materials && materials?.length > 0 && (
          <View style={styles.materialContainer}>
            {materials.map((material) => (
              <View key={material} style={styles.materialChip}>
                <Text>{material}</Text>
              </View>
            ))}
          </View>
        )
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  jobCardContainer: {
    backgroundColor: '#FFF4D8',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 2,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowOffset: { width: -3, height: 3 }, 
    shadowRadius: 0,
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageWrapper: {
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  materialContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  materialChip: {
    backgroundColor: '#D1963A',
    borderRadius: 2,
    padding: 5,
    borderColor: '#000000',
    borderWidth: 1,
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
    fontSize: 20,
    color: '#000000',
  },
  price: {
    fontSize: 18,
    color: '#000000',
  },
});

export default JobCard;

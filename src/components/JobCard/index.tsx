import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { Job } from 'types/job';
import { PartType } from 'types/part_type';
import { Material } from 'types/material';
import Placeholder from 'assets/no_image_placeholder.png';

const JobCard = ({ job, part, materials }: { job: Job, part: PartType, materials: Material[] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (job && part) {
      setLoading(false);
    }
  }, [job, part]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const { price } = job;
  const { name, imageIds: partImageIds } = part;

  return (
    <View style={styles.jobCardContainer}>
      <View style={styles.imageWrapper}>
        { !partImageIds.length ? <Image source={Placeholder} style={styles.image} /> :  <Image source={{ uri: partImageIds[0] }} style={styles.image} />}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.namePriceContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{price} MAD</Text>
        </View>
        { materials.length > 0 && (
          <View style={styles.materialContainer}>
            {materials.map((material) => (
              <View key={material.id} style={styles.materialChip}>
                <Text>{material.name}</Text>
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
    fontSize: 24,
    color: '#000000',
  },
  price: {
    fontSize: 18,
    color: '#000000',
  },
});

export default JobCard;

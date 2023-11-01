import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { Job } from 'types/job';
import { PartType } from 'types/part_type';

const JobCard = ({ job, part }: { job: Job, part: PartType }) => {
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
      <Image source={{ uri: partImageIds[0] }} style={styles.image} />
      <View style={styles.namePriceContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{price} MAD</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  jobCardContainer: {
    backgroundColor: '#929292',
    borderWidth: 3,
    borderColor: '#FFC01D',
    borderRadius: 2,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 225,
  },
  namePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  name: {
    fontSize: 24,
    color: 'black',
  },
  price: {
    fontSize: 18,
    color: '#FFC01D',
  },
});

export default JobCard;

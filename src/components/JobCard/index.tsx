import React from 'react';
import { Text, View, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { Job } from 'types/job';

const JobCard = ({ job }: { job: Job }) => {
  console.log('JobCard', job);
  const { _id, price, dropoffAddressId, instructions, imageIds, partId, dueDate } = job;

  const name = 'Handle Bar';

  return (
    <View style={styles.jobCardContainer}>
      <View style={styles.leftContent}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{price} MAD</Text>
      </View>
      {imageIds && imageIds.length > 0 && (
        <Image source={{ uri: imageIds[0] }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  jobCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  leftContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});

export default JobCard;

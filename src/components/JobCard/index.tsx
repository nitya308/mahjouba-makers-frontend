import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { Job } from 'types/job';
import { PartType } from 'types/part_type';
import { DEFAULT_PART_URI } from 'utils/constants';

const JobCard = ({ job, part }: { job: Job, part: PartType }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (job && part) {
      console.log('Part', part);
      setLoading(false);
    }
  }, [job, part]);

  const partUri = useMemo(() => (
    part && part.imageIds && part?.imageIds.length > 0 ?
      part.imageIds[0] :
      DEFAULT_PART_URI
  ), [part]);

  const name = useMemo(() => (
    part?.name || 'Unnamed part'
  ), [part]);

  const price = useMemo(() => {
    return job?.price || 0;
  }, [part]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.jobCardContainer}>
      <Image source={{ uri: partUri }} style={styles.image} />
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

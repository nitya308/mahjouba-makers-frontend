import React from 'react';
import { Text } from 'native-base';
import { StyleSheet } from 'react-native';

const JobCard = () => { 
  return (
    <>
      <Text style={styles.JobCard}>JobCard</Text>
    </>
  );
};

const styles = StyleSheet.create({
  JobCard: {
    flex: 1,
  },
});

export default JobCard;


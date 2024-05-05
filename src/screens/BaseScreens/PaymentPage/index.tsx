import TextHighlighter from 'components/SpeechHighlighter';
import { IconButton, Pressable, VStack } from 'native-base';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import AppStyles from 'styles/commonstyles';
import AudioIcon from '../../../assets/audio_icon.svg';
import useAppSelector from 'hooks/useAppSelector';
import { jobsSelector } from 'redux/slices/jobsSlice';
import PaidJobCard from 'components/PaidJobCard/PaidJobCard';
import PendingJobCard from 'components/PaidJobCard/PendingJobCard';

const PaymentPage = () => {

  const { t } = useTranslation();
  const [pressed, setPressed] = useState(false);

  const { jobsMap, partsMap, materialsMap, jobHistoryIds } = useAppSelector(jobsSelector);
  console.log('jobhistoryids', jobHistoryIds);

  

  // TODO: sort jobHistoryIds into paid and unpaid ones
  // Have some system to get paid ones from cashplus when refreshed (+ every 24 hours) and update their status if there's a new paid job? 

  return (
    <SafeAreaView>
      <VStack space={4} marginTop={5} marginBottom={2} style={AppStyles.paddingContainer}>
        <TextHighlighter style={AppStyles.left_heading} text={t('Earnings')} pressed={pressed} setPressed={setPressed} />
        <TextHighlighter style={AppStyles.bodyTextMd} text={t('Total Earned this year: 5000 M.A.D')} pressed={pressed} setPressed={setPressed} />
      </VStack>

      <ScrollView >
        <VStack space={4} marginTop={5} marginBottom={2} style={AppStyles.paddingContainer}>
          <TextHighlighter style={AppStyles.bodyTextLg} text={t('Pending Collection')} pressed={pressed} setPressed={setPressed} />
        </VStack>
        {jobHistoryIds.map((jobId: string) => {
          const job = jobsMap[jobId];
          const part = partsMap[job.partTypeId];
          const materials = part?.materialIds?.map((materialId: string) => {
            const material = materialsMap[materialId];
            return material ? material.name : ''; // Return the name if available, otherwise an empty string
          });
          return (
            <PendingJobCard job={job} part={part} materials={materials} pressed={pressed} setPressed={setPressed} />
          );
        })}

        <VStack space={4} marginTop={5} marginBottom={2} style={AppStyles.paddingContainer}>
          <TextHighlighter style={AppStyles.bodyTextLg} text={t('Cash Collected')} pressed={pressed} setPressed={setPressed} />
        </VStack>

        {jobHistoryIds.map((jobId: string) => {
          const job = jobsMap[jobId];
          const part = partsMap[job.partTypeId];
          const materials = part?.materialIds?.map((materialId: string) => {
            const material = materialsMap[materialId];
            return material ? material.name : ''; // Return the name if available, otherwise an empty string
          });
          return (
            <PaidJobCard job={job} part={part} materials={materials} pressed={pressed} setPressed={setPressed} />
          );
        })}
      </ScrollView>
      <IconButton
        icon={<AudioIcon />}
        onPress={() => {
          setPressed(true);
        }}
        style={AppStyles.audioButtonStyle}
      />
    </SafeAreaView>
  );
};

export default PaymentPage;

const styles = StyleSheet.create({});

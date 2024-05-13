import React, { useMemo, useState } from 'react';
import { Text, View, Image, HStack, VStack } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import useAppSelector from 'hooks/useAppSelector';
import { JOB_STATUS_ENUM, Job } from 'types/job';
import { PartType } from 'types/part_type';
import Placeholder from 'assets/no_image_placeholder.png';
import Modal from 'react-native-modal';
import BackCircle from '../../assets/back_circle.svg';
import { useTranslation } from 'react-i18next';
import TextHighlighter from 'components/SpeechHighlighter';
import AppStyles from 'styles/commonstyles';
import Colors from 'utils/Colors';
import SharpButton from 'components/SharpButton';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { fonts } from 'utils/constants';


const PendingJobCard = (
  { job, part, pressed, setPressed }:
  { job: Job, part: PartType, materials: string[], pressed: boolean, setPressed: React.Dispatch<React.SetStateAction<boolean>> },
) => {

  const [showToken, setShowToken] = useState(false);
  const { t } = useTranslation();
  const photoMap = useAppSelector((state) => state.photos.photosMap);
  const daysLeft = useMemo(() => {
    // TODO: this needs to be from approval date
    if (job?.completionDate) {
      const completionDate = new Date(job.completionDate);
      const currentDate = new Date();
      const timeDiff = Math.abs(currentDate.getTime() - completionDate.getTime());
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return 30 - daysDiff;
    }
    return null;
  }, [job?.completionDate]);

  // Display different image depending on current jobStatus
  const imageUrl = (job?.jobStatus === JOB_STATUS_ENUM.COMPLETE || job?.jobStatus === JOB_STATUS_ENUM.PENDING_REVIEW)
    ? (photoMap?.[job?.imageIds[0]]?.fullUrl)
    : (photoMap?.[part?.mainImageId]?.fullUrl);

  const completionDate = job?.completionDate ? new Date(job.completionDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) : null;

  return (
    <View style={styles.jobCardContainer}>
      <View style={AppStyles.rowFlexStart}>

        {imageUrl && imageUrl !== ''
          ? <Image source={{ uri: imageUrl }} style={styles.image} alt="part image" />
          : <Image source={Placeholder} style={styles.image} alt="image not found" />
        }

        <VStack space={1} padding={2} style={{ flexGrow: 1 }}>
          <View style={AppStyles.row}>
            <TextHighlighter style={AppStyles.bodyTextLg} text={t(part?.name)} pressed={pressed} setPressed={setPressed} />
            <TextHighlighter style={AppStyles.bodyTextMd} text={t(job?.price?.toString() + ' ' + 'MAD')} pressed={pressed} setPressed={setPressed} />
          </View>

          {completionDate && (
            <TextHighlighter style={styles.completionDate} text={t('Completed' + ' ' + completionDate)} pressed={pressed} setPressed={setPressed} />
          )}
          {job?.jobStatus === JOB_STATUS_ENUM.COMPLETE &&
            <HStack justifyContent='flex-end' alignItems='center' space={2}>
              {daysLeft && daysLeft > 0 ?
                <>
                  <TextHighlighter style={styles.timeLeft} text={t(daysLeft + ' days left to:')} pressed={pressed} setPressed={setPressed} />
                  <SharpButton
                    onPress={() => setShowToken(true)}>
                    <TextHighlighter style={AppStyles.buttonText} text={t('Collect')} pressed={pressed} setPressed={setPressed} />
                  </SharpButton>
                </>
                :
                <TextHighlighter style={styles.timeLeft} text={t('Collection date expired')} pressed={pressed} setPressed={setPressed} />
              }
            </HStack>

          }
        </VStack>
      </View>
      <Modal isVisible={showToken} backdropOpacity={0.7} style={styles.tokenModal}>
        <TouchableOpacity style={styles.exitModal} onPress={() => setShowToken(false)}>
          <BackCircle width={40} height={40} />
        </TouchableOpacity>
        <TextHighlighter style={AppStyles.center_heading} text={t('Collect Money')} pressed={pressed} setPressed={setPressed} />
        <VStack space={1} mt={5}>
          <View style={AppStyles.row}>
            <TextHighlighter style={{ ...AppStyles.bodyTextLg, color: Colors.jobButton }} text={t(part?.name)} pressed={pressed} setPressed={setPressed} />
            <TextHighlighter style={{ ...AppStyles.bodyText, color: Colors.jobButton }} text={t(job?.price?.toString() + ' ' + 'MAD')} pressed={pressed} setPressed={setPressed} />
          </View>

          {completionDate && (
            <TextHighlighter style={{ ...AppStyles.bodyText, color: Colors.jobButton }} text={t('Completed' + ' ' + completionDate)} pressed={pressed} setPressed={setPressed} />
          )}
        </VStack>
        <VStack space={1} mt={5} mb={2}>
          <Text style={AppStyles.bodyTextLg}>Token:</Text>
          <Text style={styles.tokenBox}>21AWGEQ7JKER</Text>
        </VStack>
        <TextHighlighter style={styles.timeLeft} text={t(daysLeft + ' days left')} pressed={pressed} setPressed={setPressed} />
        <TextHighlighter style={styles.info} text={t('Show this token at a CashPlus center and get your cash')} pressed={pressed} setPressed={setPressed} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  jobCardContainer: {
    borderWidth: 2,
    borderColor: '#F2F1EC',
  },
  completionDate: {
    fontSize: 18,
    color: Colors.darkGray,
  },
  exitModal: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
  },
  image: {
    height: 65,
    minWidth: 65,
  },
  cardContent: {
    padding: 10,
  },
  timeLeft: {
    color: 'red',
    fontSize: 18,
  },
  info:{
    fontSize: 18,
    color: Colors.jobButton,
    marginTop: 10, 
  },
  tokenBox: {
    borderWidth: 2,
    borderColor: Colors.outline,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    fontFamily: fonts.bold,
    fontWeight: '600',
  },
  tokenModal: {
    flex: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    padding: 25,
    marginTop: ScreenHeight / 2 - 150,
    height: 350,
    marginHorizontal: 20,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: Colors.outline,
    backgroundColor: 'white',
  },
});

export default PendingJobCard;
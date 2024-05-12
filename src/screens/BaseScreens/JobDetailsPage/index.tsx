import React, { useState } from 'react';
import { View, Text, Image, Spinner, IconButton, VStack, Flex, Row } from 'native-base';
import { ScrollView, StyleSheet } from 'react-native';
import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';
import { authSelector } from 'redux/slices/authSlice';
import { jobsSelector, acceptJob, unacceptJob } from 'redux/slices/jobsSlice';
import HammerIcon from '../../../assets/hammer2.svg';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { JOB_STATUS_ENUM } from 'types/job';
import SharpButton from 'components/SharpButton';
import AudioIcon from '../../../assets/audio_icon.svg';
import { fonts } from 'utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import XIcon from 'assets/x.svg';
import BackCircle from 'assets/back_circle.svg';
import { TouchableOpacity } from 'react-native';
import Money1 from '../../../assets/money1.svg';
import Placeholder from 'assets/no_image_placeholder.png';
import TimeRemainingIcon from '../../../assets/time-remaining.svg';
import MapPinIcon from '../../../assets/map_pin.svg';
import MADIcon from '../../../assets/MADIcon.png';
import Colors from 'utils/Colors';
import AppStyles from 'styles/commonstyles';
import TextHighlighter from 'components/SpeechHighlighter';
import { useTranslation } from 'react-i18next';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

const JobDetailsPage = ({
  jobId,
  exit,
}: {
  jobId: string;
  exit: () => void;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { jobsMap, partsMap, materialsMap, loading, currentJobId } = useAppSelector(jobsSelector);
  const addressMap = useAppSelector((state) => state.addresses.addressMap);
  const photoMap = useAppSelector((state) => state.photos.photosMap);


  const job = jobsMap[jobId];
  const part = partsMap[job.partTypeId];
  const materials = part?.materialIds?.map((materialId: string) => {
    const material = materialsMap[materialId];
    return material ? material.name : ''; // Return the name if available, otherwise an empty string
  });
  const address = addressMap?.[job?.dropoffAddressId];

  // Display different image depending on current jobStatus
  const imageUrl = (job?.jobStatus === JOB_STATUS_ENUM.COMPLETE || job?.jobStatus === JOB_STATUS_ENUM.PENDING_REVIEW)
    ? (photoMap?.[job?.imageIds[0]]?.fullUrl)
    : (photoMap?.[part?.mainImageId]?.fullUrl);

  const [pressed, setPressed] = useState(false);

  const { t } = useTranslation();

  if (loading) {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      <ScrollView >
        <View style={styles.imageWrapper}>
          {part?.mainImageId
            ? <Image source={{ uri: imageUrl }} style={styles.image} alt="part image" />
            : <Image source={Placeholder} style={styles.image} alt="image not found" />
          }
        </View>
        <IconButton
          style={AppStyles.audioStyle}
          icon={<AudioIcon />}
          onPress={() => {
            setPressed(true);
          }}
        />

        <TouchableOpacity style={styles.exit} onPress={exit}>
          <BackCircle width={40} height={40} />
        </TouchableOpacity>

        {part && job &&
          <>
            <VStack width="100%" alignItems='center' mb={5}>
              {!part.mainImageId ? <Image alt='placeholder' source={Placeholder} style={styles.image} /> : <Image alt='part' source={{ uri: imageUrl }} style={styles.image} />}
            </VStack>
            <View style={styles.partDetails}>
              <TextHighlighter style={AppStyles.left_heading} text={t(part.name)} pressed={pressed} setPressed={setPressed} />
              <View style={[styles.greyBox, styles.greyBoxTop]}>
                <View style={{ flexDirection:'row' }}>
                  <Text><TextHighlighter style={styles.partDetailsHeader} text={'Pay '} pressed={pressed} setPressed={setPressed} /></Text>
                  <Text><TextHighlighter text={t(job?.price.toString()) + t(' MAD')} pressed={pressed} setPressed={setPressed} /></Text>
                </View>
                <View style={{ flexDirection:'row' }}>
                  <Text><TextHighlighter style={styles.partDetailsHeader} text={'Time '} pressed={pressed} setPressed={setPressed} /></Text>
                  <Text><TextHighlighter text={t(part.completionTime.toString()) + t(' hours')} pressed={pressed} setPressed={setPressed}/></Text>
                </View>
                <Text>Time <TextHighlighter text={t(part.completionTime.toString()) + t(' hours')} pressed={pressed} setPressed={setPressed}/></Text>
              </View>
              <View style={[styles.greyBox, styles.greyBoxBottom]}>
                <Text><TextHighlighter style={styles.partDetailsHeader} text={t('Location ')} pressed={pressed} setPressed={setPressed} /></Text>
                <Text><TextHighlighter text={t(address.street.toString()) + '\n' + t(address.city.toString()) } pressed={pressed} setPressed={setPressed} /></Text>
                <Text><TextHighlighter text={ t(address.country.toString()) + ', ' + t(address.postalCode.toString())} pressed={pressed} setPressed={setPressed} /></Text>
              </View> 
              <View style={[styles.greyBox, styles.greyBoxBottom]}>
                <Text><TextHighlighter style={styles.partDetailsHeader} text={'Materials'} pressed={pressed} setPressed={setPressed} /></Text>
                {materials.map((material, index) => (
                  <Text key={material}>
                    {index < materials.length - 1 &&
                        <TextHighlighter text={t(material + ',')} pressed={pressed} setPressed={setPressed} />
                    }
                    {index == materials.length - 1 &&
                        <TextHighlighter text={t(material)} pressed={pressed} setPressed={setPressed} />
                    }
                  </Text>
                ))}
                
              </View>
              {jobId !== currentJobId ?
                <View style={styles.acceptButton}>
                  <SharpButton
                    width={'200px'}
                    borderColor={Colors.jobButton}
                    borderWidth={'1px'}
                    backgroundColor={Colors.jobButton}
                    my='2px'
                    size='sm'
                    onPress={() => {
                      dispatch(acceptJob({ jobId: jobId ?? '', fbUserRef }));
                    }}
                    marginTop={'0px'}
                  >
                    <TextHighlighter style={styles.acceptJob} text={t('Accept Job')} pressed={pressed} setPressed={setPressed} />
                  </SharpButton>
                </View>
                :
                <View style={styles.acceptButton}>
                  <Text>You have accepted this job.</Text>
                  <SharpButton
                    width={'120px'}
                    borderColor={Colors.jobButton}
                    borderWidth={'1px'}
                    backgroundColor={Colors.jobButton}
                    my='2px'
                    size='sm'
                    onPress={() => {
                      dispatch(unacceptJob({ jobId: currentJobId ?? '', fbUserRef }));
                    }}
                    marginTop={'0px'}
                  >
                    <Text fontFamily={fonts.regular}>
                      UnAccept Job
                    </Text>
                  </SharpButton>
                </View>
              }
              
            </View>
          </>
        }


        {/* <VStack width="100%" mt='20px' alignItems='center'>
          {part && job ? (
            <>
              {!part.imageIds.length ? <Image alt='placeholder' source={Placeholder} style={styles.image} /> : <Image alt='part' source={{ uri: imageUrl }} style={styles.image} />}
              <View style={styles.infoContainer}>

              </View>
              <View style={styles.infoContainer}>
                <View style={styles.textAndIcon}>
                  <TimeRemainingIcon />
                  <TextHighlighter style={styles.text} text={t('Due in ') + t(part.completionTime.toString()) + t(' hours')} pressed={pressed} setPressed={setPressed} />
                </View>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.textAndIcon}>
                  <MapPinIcon width={28} height={28} />
                  <TextHighlighter style={styles.text} text={t(address?.description)} pressed={pressed} setPressed={setPressed} />
                </View>
                <View style={styles.textAndIcon}>
                  <Money1 width={28} height={28} />
                  <TextHighlighter style={styles.text} text={t(job?.price.toString()) + t(' MAD')} pressed={pressed} setPressed={setPressed} />
                </View>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.textAndIcon}>
                  <HammerIcon />
                  {materials.map((material, index) => (
                    <Text key={material}>
                      {index < materials.length - 1 &&
                        <TextHighlighter style={styles.text} text={t(material + ',')} pressed={pressed} setPressed={setPressed} />
                      }
                      {index == materials.length - 1 &&
                        <TextHighlighter style={styles.text} text={t(material)} pressed={pressed} setPressed={setPressed} />
                      }
                    </Text>
                  ))}
                </View>
              </View>
              {jobId !== currentJobId ?
                <View style={styles.acceptButton}>
                  <SharpButton
                    width={'200px'}
                    borderColor={Colors.yellow}
                    borderWidth={'1px'}
                    backgroundColor={'rgba(255, 192, 29, 0.5)'}
                    my='2px'
                    size='sm'
                    onPress={() => {
                      dispatch(acceptJob({ jobId: jobId ?? '', fbUserRef }));
                    }}
                    marginTop={'10px'}
                  >
                    <TextHighlighter style={styles.name} text={t('Accept Job')} pressed={pressed} setPressed={setPressed} />
                  </SharpButton>
                </View>
                :
                <View style={styles.acceptButton}>
                  <Text>You have accepted this job.</Text>
                  <SharpButton
                    width={'120px'}
                    borderColor={Colors.yellow}
                    borderWidth={'1px'}
                    backgroundColor={'rgb(255, 192, 29, 0.5)'}
                    my='2px'
                    size='sm'
                    onPress={() => {
                      dispatch(unacceptJob({ jobId: currentJobId ?? '', fbUserRef }));
                    }}
                    marginTop={'10px'}
                  >
                    <Text fontFamily={fonts.regular}>
                      UnAccept Job
                    </Text>
                  </SharpButton>
                </View>
              }
            </>
          ) : (
            <Text style={styles.text}>Loading{job?.partTypeId}</Text>
          )}
        </VStack> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  exit: {
    position: 'absolute',
    top: 10,
    left: 5,
    zIndex: 5,
  },
  container: {
    backgroundColor: '#ffffff',
    height: '90%',
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    paddingHorizontal: 20,
  },
  acceptButton: {
    marginLeft: ScreenWidth / 7,
    marginRight: ScreenWidth / 7,
    marginBottom: 20,
    marginTop: 20,
  },
  materialContainer: {
    width: '90%',
    alignSelf: 'center',
    borderColor: '#000000',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  textAndIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 5,
  },
  infoHeader: {
    backgroundColor: '#FFF4D8',
    padding: 10,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  partDetailsHeader: {
    color: '#3A3449',
    fontSize: 20,
    fontWeight: '200',
    fontStyle: 'normal',
  },
  infoContainer: {
    width: '90%',
    borderColor: Colors.yellow,
    borderWidth: 1,
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  infoBody: {
    padding: 10,
  },
  partDetails:{
    alignContent: 'center',
    marginRight: 10,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  greyBox: {
    marginTop: 25,
    padding: 10,
    justifyContent: 'space-around',
    alignContent: 'center',
    backgroundColor: '#F2F1EC',
    borderRadius: 10,
  },
  greyBoxTop: {
    flexDirection: 'row',
    width: 330,
    height: 42,
  },
  greyBoxBottom: { 
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 148,
    height: 150,
    display: 'flex',
    flexDirection: 'column',
  },
  timeRemainingText: {
    fontSize: 20,
    lineHeight: 24,
  },
  image: {
    marginTop: 75,
    height: 300,
  },
  name: {
    fontSize: 30,
    fontFamily: fonts.bold,
    marginTop: 0,
  },
  acceptJob: {
    color: '#FFF',
    fontSize: 30,
    fontFamily: fonts.bold,
  },
  text: {
    lineHeight: 25,
    fontSize: 20,
    maxWidth: '90%',
  },
  button: {
    marginTop: 10,
  },
  imageWrapper: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: -350,
  },
});

export default JobDetailsPage;

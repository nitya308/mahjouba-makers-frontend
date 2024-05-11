import React, { useState } from 'react';
import { View, Text, Image, Spinner, IconButton, VStack, Flex, Row, HStack, Box, Spacer } from 'native-base';
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
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { updateWorkshop, workshopsSelector } from 'redux/slices/workshopsSlice';

const WorkshopDetailsPage = ({
  workshopId,
  exit,
  reloadWorkshops,
}: {
  workshopId: string;
  exit: () => void;
  reloadWorkshops: () => void;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(userDataSelector).userData?._id;
  const { fbUserRef } = useAppSelector(authSelector);
  const { loading, workshopsMap } = useAppSelector(workshopsSelector);
  const addressMap = useAppSelector((state) => state.addresses.addressMap);
  const workshop = workshopsMap[workshopId];
  const isSignedUp = workshop.participantIds?.includes(userId ?? '');
  const workshopTitle = workshop.name;
  const time = workshop.workshopTime;
  const description = workshop.description;
  const instructor = workshop.instructor;
  const location = addressMap[workshop.location].description;
  const capacity = workshop.capacity;
  const participantsNumber = workshop.participantIds?.length;
  const spotsLeft = capacity - participantsNumber;
  const [pressed, setPressed] = useState(false);
  const { t } = useTranslation();
  const formatDate = (date: string): string => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true,
    };
    return d.toLocaleString('en-US', options);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      <ScrollView >
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

        <>
          <VStack width="100%" mb={5}>
            {/* {!imageUrl ? <Image alt='placeholder' source={Placeholder} style={styles.image} /> :  />} */}
            <TextHighlighter style={styles.name} text={t(workshopTitle)} pressed={pressed} setPressed={setPressed} />
            <TextHighlighter style={styles.text} text={t(description)} pressed={pressed} setPressed={setPressed} />
            <TextHighlighter style={styles.text} text={t(instructor)} pressed={pressed} setPressed={setPressed} />
            <TextHighlighter style={styles.text} text={t(location)} pressed={pressed} setPressed={setPressed} />
            <TextHighlighter style={styles.text} text={t(formatDate(time.toString()))} pressed={pressed} setPressed={setPressed} />
            <TextHighlighter style={styles.text} text={t(spotsLeft.toString())} pressed={pressed} setPressed={setPressed} />

            {!isSignedUp && spotsLeft > 0 ? // Case 1: user can sign up
              <View style={styles.acceptButton}>
                <SharpButton
                  width={'200px'}
                  borderColor={Colors.yellow}
                  borderWidth={'1px'}
                  backgroundColor={'rgba(255, 192, 29, 0.5)'}
                  my='2px'
                  size='sm'
                  onPress={() => {
                    // add the current user to the workshop participantIds
                    const updatedParticipantIds = [...workshop.participantIds, userId ?? ''];
                    const updatedWorkshop = { participantIds: updatedParticipantIds };
                    dispatch(updateWorkshop({ id: workshopId, updates: updatedWorkshop, fbUserRef: fbUserRef }));
                    reloadWorkshops();
                    exit();
                  }}
                  marginTop={'0px'}
                >
                  <TextHighlighter style={styles.name} text={t('Sign Up')} pressed={pressed} setPressed={setPressed} />
                </SharpButton>
              </View>
              : !isSignedUp && spotsLeft <= 0 ? ( // Case 2: user cannot sign up if there are no spots left
                <View style={styles.acceptButton}>
                  <TextHighlighter style={styles.name} text={t('There are no spots left for this workshop')} pressed={pressed} setPressed={setPressed} />
                  {/* <SharpButton
                    width={'120px'}
                    borderColor={Colors.yellow}
                    borderWidth={'1px'}
                    backgroundColor={'rgb(255, 192, 29, 0.5)'}
                    my='2px'
                    size='sm'
                    onPress={() => {
                    // remove the current user from the workshop participantIds
                      workshop.participantIds.splice(workshop.participantIds.indexOf(id), 1);
                      dispatch(updateWorkshop({ id: workshopId, updates: workshop, fbUserRef: fbUserRef }));
                    }}
                    marginTop={'0px'}
                  >
                    <TextHighlighter style={styles.name} text={t('Withdraw')} pressed={pressed} setPressed={setPressed} />
                  </SharpButton> */}
                </View> ) : ( // Case 3: user is signed up
                <View style={styles.acceptButton}>
                  <TextHighlighter style={styles.text} text={t('You are currently signed up for this workshop')} pressed={pressed} setPressed={setPressed} />
                  <SharpButton
                    width={'180px'}
                    borderColor={Colors.yellow}
                    borderWidth={'1px'}
                    backgroundColor={'rgb(255, 192, 29, 0.5)'}
                    size='sm'
                    my={'0px'}
                    onPress={() => {
                      // remove the current user from the workshop participantIds
                      const userIndex = workshop.participantIds.indexOf(userId ?? '');
                      const updatedParticipantIds = [...workshop.participantIds.slice(0, userIndex), ...workshop.participantIds.slice(userIndex + 1)];
                      const updatedWorkshop = { participantIds: updatedParticipantIds };
                      dispatch(updateWorkshop({ id: workshopId, updates: updatedWorkshop, fbUserRef: fbUserRef })); 
                      reloadWorkshops();
                      exit();
                    }}
                  >
                    <TextHighlighter style={styles.name} text={t('Withdraw')} pressed={pressed} setPressed={setPressed} />
                  </SharpButton>
                </View> 
              )
            }
          </VStack>
        </>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({

  workshopCardContainer: {
    borderRadius: 10,
    // shadowColor: '#3A3449',
    // shadowOpacity: 0.15,
    // shadowRadius: 1,
    borderWidth: 2,
    borderColor: '#F2F1EC',

  },
  exit: {
    position: 'absolute',
    top: 25,
    left: 5,
    zIndex: 5,
  },
  container: {
    padding: 20,
    justifyContent: 'center',
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
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',

  },
  greyBox: {
    marginTop: 25,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F2F1EC',
    borderRadius: 10,
  },
  greyBoxTop: {
    width: 310,
    height: 42,
  },
  greyBoxBottom: {
    width: 148,
    height: 78,
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
    marginTop: 200,
    textAlign: 'left',
  },
  text: {
    lineHeight: 25,
    fontSize: 20,
    textAlign: 'left',
    maxWidth: '90%',
  },
  button: {
    marginTop: 0,
  },
});

export default WorkshopDetailsPage;

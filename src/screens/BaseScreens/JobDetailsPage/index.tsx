import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, Button, Center, Spinner } from 'native-base';
import { StyleSheet } from 'react-native';
import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';
import { authSelector } from 'redux/slices/authSlice';
import { jobsSelector } from 'redux/slices/jobsSlice';
import { getUser, updateUser, userDataSelector } from 'redux/slices/userDataSlice';
import SharpButton from 'components/SharpButton';
import { addressApi, jobsApi, usersApi } from 'requests';
import { fonts } from 'utils/constants';
import { Job } from 'types/job';
import { PartType } from 'types/part_type';
import Address from 'types/address';
import { SafeAreaView } from 'react-native-safe-area-context';
import XIcon from 'assets/x.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Placeholder from 'assets/no_image_placeholder.png';
import TimeRemainingIcon from '../../../assets/time-remaining.svg';
import MapPinIcon from '../../../assets/map_pin.svg';
import MADIcon from '../../../assets/MADIcon.png';
import Colors from 'utils/Colors';

const JobDetailsPage = ({
  jobId,
  exit,
}: {
  jobId: string;
  exit: () => void;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { userData } = useAppSelector(userDataSelector);
  const { partsMap, materialsMap } = useAppSelector(jobsSelector);
  const [job, setJob] = useState<Job | undefined>();
  const [address, setAddress] = useState<Address | undefined>();
  const [part, setPart] = useState<PartType | undefined>();
  const [materials, setMaterials] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) return;
    const pullJob = async () => {
      if (!fbUserRef) return;
      try {
        setLoading(true);
        const dbJob = await jobsApi.getJob(jobId, fbUserRef);
        const dbAddress = await addressApi.getAddress(dbJob.dropoffAddressId, fbUserRef);
        if (dbJob) {
          setJob(dbJob);
        }
        if (dbAddress) {
          setAddress(dbAddress);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    pullJob();
  }, [jobId, fbUserRef]);

  useEffect(() => {
    if (!job || !(job.partTypeId in partsMap)) return;
    setPart(partsMap[job.partTypeId]);

  }, [job, partsMap]);

  useEffect(() => {
    if (!part) return;
    const newMaterials: string[] = [];
    part.materialIds.forEach((materialId) => {
      if (materialId in materialsMap) {
        newMaterials.push(materialsMap[materialId].name);
      }
    });
    setMaterials(newMaterials);
  }, [part, materialsMap]);

  const acceptJob = useCallback(async () => {
    if (!fbUserRef) return;
    try {
      dispatch(updateUser({
        updates: {
          currentJobId: jobId,
        },
        fbUserRef,
      }));
    } catch (err) {
      console.log(err);
    }
  }, [jobId, fbUserRef]);

  console.log(job, part, address, materials);

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Spinner />}
      {part && job ? (
        <>
          <TouchableOpacity style={styles.exit} onPress={exit}>
            <XIcon width={30} height={30} />
          </TouchableOpacity>
          { !part.imageIds.length ? <Image alt='placeholder' source={Placeholder} style={styles.image} /> :  <Image alt='part' source={{ uri: part.imageIds[0] }} style={styles.image} />}
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Text style={styles.name}>{part.name}</Text>
            </View>
            <View style={styles.infoBody}>
              <View style={styles.textAndIcon}>
                <TimeRemainingIcon/>
                <Text style={styles.text}>{`${part.completionTime} hours`}</Text>
              </View>
              <View style={styles.textAndIcon}>
                <MapPinIcon width={28} height={28}/>
                <Text style={[styles.text, { maxWidth: '90%' }]}>{address?.description}</Text>
              </View>

              <View style={styles.textAndIcon}>
                <Image alt='MAD icon' source={MADIcon} style={{ width: 28, height: 28 }} />
                <Text style={styles.text}>{`${job.price} MAD`}</Text>
              </View>
            </View>
          </View>
          <View style={styles.materialContainer}>
            {materials.map((material) => (
              <View key={material}>
                <Text style={styles.text}>{material}</Text>
              </View>
            ))}
          </View>
          <View style={styles.acceptButton}>
            <SharpButton
              width={'120px'} 
              backgroundColor={Colors.yellow} 
              my='2px'
              size='sm' 
              onPress={acceptJob}
              marginTop={'10px'}
            >
              <Text fontFamily={fonts.regular}>
              Accept Job
              </Text>
            </SharpButton>
          </View>
        </>
      ) : (
        <Text style={styles.text}>Loading{job?.partTypeId}</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  exit: {
    padding: 10,
  },
  acceptButton: {
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: Colors.backgroundWhite,
  },
  infoContainer: {
    width: '90%',
    alignSelf: 'center',
    borderColor: '#000000',
    borderWidth: 1,
    marginBottom: 15,
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
  },
  infoHeader: {
    backgroundColor: '#FFF4D8',
    padding: 10,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  infoBody: {
    padding: 10,
  },
  timeRemainingText: {
    fontSize: 20,
    lineHeight: 24,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  name: {
    fontSize: 30,
    lineHeight: 28,
  },
  text: {
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
  },
});

export default JobDetailsPage;

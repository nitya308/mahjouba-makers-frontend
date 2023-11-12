import React, { useEffect, useState } from 'react';
import { userDataSelector } from 'redux/slices/userDataSlice';
import useAppSelector from 'hooks/useAppSelector';
import { Box, HStack, Spacer, IconButton, Icon, Button, Center, Text, Heading, ScrollView, View, Pressable } from 'native-base';
import { Image as ExpoImage } from 'expo-image';
import { AntDesign } from '@expo/vector-icons';
import { DEFAULT_PROFILE_URI } from 'utils/constants';
import { authSelector } from 'redux/slices/authSlice';
import { fonts } from 'utils/constants';
import AudioIcon from '../../assets/audio_icon.svg';
import EditIcon from '../../assets/edit_icon.svg';
import AddIcon from '../../assets/add_icon.svg';
import MapPinIcon from '../../assets/map_pin.svg';
import addressApi from 'requests/addressApi';
import { jobsSelector } from 'redux/slices/jobsSlice';
import MaterialChip from '../MaterialChip';
import Colors from 'utils/Colors';
import { Job } from 'types/job';
import JobCard from 'components/JobCard';
import * as Speech from 'expo-speech';

export default function ProfileDisplay({
  toggleEditing,
  toggleSettingsOpen,
}: {
  toggleEditing: () => void;
  toggleSettingsOpen: () => void;
}): JSX.Element {
  const { fbUserRef } = useAppSelector(authSelector);
  const { userData, profileImageUri } = useAppSelector(userDataSelector);
  const [addressString, setAddressString] = useState<string | undefined>();
  const { jobs, cursor, partsMap, materialsMap } = useAppSelector(jobsSelector);

  useEffect(() => {
    if (addressString) return;
    const pullAddress = async () => {
      if (!fbUserRef || !userData?.shippingAddressId) return;
      const address = await addressApi.getAddress(userData.shippingAddressId, fbUserRef);
      setAddressString(address.description);
    };
    pullAddress();
  }, [userData, fbUserRef, addressString]);

  // <Button mr='auto' onPress={toggleSettingsOpen}>
  // Account Settings
  // </Button>

  return (
    <Box pt='75px' width={'100%'}>
      <HStack justifyContent={'space-between'}>
        <HStack alignItems={'center'}>
          <Heading marginLeft={'20px'} marginRight={'10px'} fontFamily={fonts.semiBold}>
            My Profile
          </Heading>
          <IconButton
            icon={<AudioIcon />}
            onPress={() => {
              Speech.speak('My Profile');
              console.log('here1'); // TODO: Temp
            }}
          />
        </HStack>
        <IconButton
          icon={<EditIcon />}
          onPress={toggleEditing}
          marginRight={'20px'}
        />
      </HStack>
      <ScrollView
        width={'100%'}
        marginBottom={'180px'}
      >
        <Center my='20px'>
          <ExpoImage
            source={{
              uri: profileImageUri || DEFAULT_PROFILE_URI,
            }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 100,
              borderWidth: 3,
            }}
          />
          <Heading fontFamily={fonts.semiBold} marginTop={'10px'}>
            {userData?.name}
          </Heading>
          {
            addressString &&
            <HStack marginBottom={'10px'}>
              <MapPinIcon />
              <Text maxW='300px' numberOfLines={1} fontSize='sm' marginLeft={'5px'} fontFamily={fonts.semiBold}>
                {addressString ? addressString : null}
              </Text>
            </HStack>
          }
          <HStack>
            {
              userData?.materialIds?.map((materialId: string) => {
                const material = materialsMap[materialId];
                if (material) {
                  return <MaterialChip materialName={material?.name} />;
                }
                return <></>;
              })
            }
          </HStack>
          <View
            backgroundColor={Colors.beige}
            width={'100%'}
            position={'relative'}
            marginTop={'20px'}
            alignItems={'center'}
            justifyContent={'center'}
            height={'60px'}
            borderTopWidth={'1px'}
            borderBottomWidth={'1px'}
          >
            <HStack alignItems={'center'}>
              <Heading fontFamily={fonts.semiBold} marginRight={'10px'}>
                Past Projects
              </Heading>
              <IconButton
                icon={<AudioIcon />}
                onPress={() => {
                  Speech.speak('Past Projects');
                }}
              />
            </HStack>
          </View>
        </Center>
        {/* <Text>
          {JSON.stringify(userData)}
        </Text> */}
        {/* TODO: change to user's own job history */}
        {jobs.map((j: Job) => {
          const job = j;
          const part = partsMap[j.partTypeId];
          const materials = part.materialIds.map((materialId: string) => {
            const material = materialsMap[materialId];
            return material ? material.name : ''; // Return the name if available, otherwise an empty string
          });

          return (
            <Pressable 
              marginBottom={'15px'} 
              marginLeft={'15px'}
              marginRight={'15px'}
              key={job._id} 
              onPress={() => console.log('TODO')}
            >
              <JobCard job={job} part={part} materials={materials} />
            </Pressable>
          );
        })}
      </ScrollView>
    </Box>
  );
}
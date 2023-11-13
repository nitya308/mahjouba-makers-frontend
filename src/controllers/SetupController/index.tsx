import React, { useCallback, useState } from 'react';
import { Center, View, Heading } from 'native-base';
import ArchScroll from 'components/ArchScroll';
import Address from 'types/address';
import { Asset } from 'react-native-image-picker';
import { Box, Text } from 'native-base';
import IDSetup from './IDSetup';
import SharpButton from 'components/SharpButton';
import { Image } from 'react-native-image-crop-picker';
import MaterialSetup from './MaterialSetup';
import AddressSetup from './AddressSetup';
import ProfileSetup from './ProfileSetup';
import { authSelector, logout } from 'redux/slices/authSlice';
import useAppSelector from 'hooks/useAppSelector';
import { uploadMedia } from 'utils/mediaUtils';
import useAppDispatch from 'hooks/useAppDispatch';
import { clearUserData, initUser } from 'redux/slices/userDataSlice';

export default function SetupController(): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef, name } = useAppSelector(authSelector);

  const [progress, setProgress] = useState(0);
  const [idNo, setIdNo] = useState<string | undefined>();
  const [idPicFront, setIdPicFront] = useState<Asset | undefined>();
  const [idPicBack, setIdPicBack] = useState<Asset | undefined>();
  const [iceNo, setIceNo] = useState<string | undefined>();
  const [icePicBack, setIcePicBack] = useState<Asset | undefined>();
  const [icePicFront, setIcePicFront] = useState<Asset | undefined>();
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Address | undefined>();
  const [selectedProfileImage, setSelctedProfileImgae] = useState<Image | undefined>();
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = useCallback(async () => {
    if (!idNo || !iceNo || !selectedLocation || !idPicBack?.uri || !idPicFront?.uri || !icePicBack?.uri || !icePicFront?.uri || !fbUserRef || !name) return;

    console.log([idPicFront, idPicBack]);
    const idPicFrontUploadUri = await uploadMedia(`${fbUserRef?.uid}-idFront.jpeg`, idPicFront.uri);
    const idPicBackUploadUri = await uploadMedia(`${fbUserRef?.uid}-idBack.jpeg`, idPicBack.uri);

    const icePicFrontUploadUri = await uploadMedia(`${fbUserRef?.uid}-iceFront.jpeg`, icePicFront.uri);
    const icePicBackUploadUri = await uploadMedia(`${fbUserRef?.uid}-iceBack.jpeg`, icePicBack.uri);

    if (!idPicFrontUploadUri || !idPicBackUploadUri || !icePicFrontUploadUri || !icePicBackUploadUri) {
      setError('Image upload failed');
      return;
    }

    let profilePicUri: string | undefined = undefined;
    if (selectedProfileImage) {
      profilePicUri = await uploadMedia(`${fbUserRef?.uid}-profile.jpeg`, `file://${selectedProfileImage?.path}`);
    }

    dispatch(initUser({
      userData: {
        name,
        email: fbUserRef.email !== null ? fbUserRef.email : fbUserRef.phoneNumber,
        homeAddress: selectedLocation,
        shippingAddress: selectedLocation,
        profilePic: profilePicUri ? {
          fullUrl: profilePicUri,
          fileType: 'image/jpeg',
        } : undefined,
        idFront: {
          fullUrl: idPicFrontUploadUri,
          fileType: 'image/jpeg',
        },
        idBack: {
          fullUrl: idPicBackUploadUri,
          fileType: 'image/jpeg',
        },
        iceFront: {
          fullUrl: icePicFrontUploadUri,
          fileType: 'image/jpeg',
        },
        iceBack: {
          fullUrl: icePicBackUploadUri,
          fileType: 'image/jpeg',
        },
        idNo,
        iceNo,
      },
      fbUserRef,
    }));
  }, [name, idNo, idPicBack, idPicFront, iceNo, icePicFront, icePicBack, selectedLocation, selectedMaterialIds, selectedProfileImage, fbUserRef]);
  
  const handleIdSelectComplete = useCallback(() => {
    if (!idNo || !idPicBack || !idPicFront) {
      setError('Please complete required fields');
    } else {
      console.log(idNo);
      console.log(idPicBack);
      console.log(idPicFront);
      setError(undefined);
      setProgress(progress + 1);
    }
  }, [progress, idNo, setProgress, idPicBack, idPicBack]);

  const handleICESelectComplete = useCallback(() => {
    if (!iceNo || !icePicBack || !icePicFront) {
      setError('Please complete required fields');
    } else {
      setError(undefined);
      setProgress(progress + 1);
    }
  }, [progress, iceNo, setProgress, icePicBack, icePicBack]);

  const handleMaterialSelectComplete = useCallback(() => {
    setError(undefined);
    setProgress(progress + 1);
  }, [progress, setProgress]);

  const handleAddressSelectComplete = useCallback(() => {
    if (!(selectedLocation)) {
      setError('Please complete required fields');
    } else {
      setError(undefined);
      setProgress(progress + 1);
    }
  }, [progress, setProgress, selectedLocation, setSelectedLocation]);

  const returnToPrevious = useCallback(() => {
    if (progress > 0) {
      setError(undefined);
      setProgress(progress - 1);
    } else {
      dispatch(logout({}));
      dispatch(clearUserData());
    }
  }, [progress, setProgress]);

  const getCurrentComponent = useCallback(() => {
    switch (progress) {
      case 0:
        return <Box w='90%' mx='auto'>
          <Heading fontSize='lg'>
            ID Card
          </Heading>
          <IDSetup
            idNo={idNo}
            setIdNo={setIdNo}
            idPhotoBack={idPicBack}
            setIdPhotoBack={setIdPicBack}
            idPhotoFront={idPicFront}
            setIdPhotoFront={setIdPicFront}
          />
          <SharpButton onPress={handleIdSelectComplete} mt='10px'>
            <Text color='black'>Next</Text>
          </SharpButton>
        </Box>;
      case 1:
        return <Box w='90%' mx='auto'>
          <Heading fontSize='lg'>
            ICE Card
          </Heading>
          <IDSetup
            idNo={iceNo}
            setIdNo={setIceNo}
            idPhotoBack={icePicBack}
            setIdPhotoBack={setIcePicBack}
            idPhotoFront={icePicFront}
            setIdPhotoFront={setIcePicFront}
          />
          <SharpButton onPress={handleICESelectComplete} mt='10px'>
            <Text color='black'>Next</Text>
          </SharpButton>
        </Box>;
      case 2:
        return <Box mx='auto'>
          <MaterialSetup
            selectedMaterialIds={selectedMaterialIds}
            setSelectedMaterialIds={setSelectedMaterialIds}
          />
          <SharpButton onPress={handleMaterialSelectComplete} mt='10px'>
            <Text color='black'>Next</Text>
          </SharpButton>
        </Box>;
      case 3:
        return <Box w='90%' mx='auto'>
          <AddressSetup
            selectedAddress={selectedLocation}
            setSelectedAddress={setSelectedLocation}
          />
          <SharpButton onPress={handleAddressSelectComplete} mt='10px'>
            <Text color='black'>Next</Text>
          </SharpButton>
        </Box>;
      case 4:
        return <Box w='90%' mx='auto'>
          <ProfileSetup
            selectedImage={selectedProfileImage}
            setSelectedImage={setSelctedProfileImgae}
          />
          <SharpButton onPress={handleSubmit} color='black' my='10px'>
            <Text color='black'>Next</Text>
          </SharpButton>
        </Box>;
      default:
        return <></>;
    }
  }, [progress, selectedLocation, selectedProfileImage, selectedMaterialIds, idPicBack, idPicFront, icePicFront, icePicBack, idNo, iceNo, handleSubmit]);

  return <View flex='1'>
    <ArchScroll>
      <Center h='100%'>
        {getCurrentComponent()}
        <SharpButton color='black' bgColor='white' py='4px' onPress={returnToPrevious} mt='10px'>
          <Text fontSize='xs'>Back</Text>
        </SharpButton>
        {
          error && <Text color='red.500' fontSize='xs' mt='10px'>{error}</Text>
        }
      </Center>
    </ArchScroll>
  </View>;
}

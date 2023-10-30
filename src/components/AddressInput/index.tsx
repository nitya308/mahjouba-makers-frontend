import React, { useEffect, useState } from 'react';
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MAPS_API_KEY } from '@env';
import { buildAddr } from 'utils/geoUtils';
import Address from 'types/address';
import { View, Text } from 'native-base';

export default function AddressInput({
  setAddress,
  placeholder,
}: {
  setAddress: (newAddr?: Address) => void;
  placeholder?: string;
}): JSX.Element {
  const [selectedPlace, setSelectedPlace] = useState<GooglePlaceDetail | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // update selected location for component usage
    if (!selectedPlace) return;
    setAddress(buildAddr(selectedPlace));
  }, [selectedPlace]);

  return (
    <View w='100%' h={active ? '150px' : '50px'}>
      <GooglePlacesAutocomplete
        placeholder={placeholder || 'Search'}
        fetchDetails={true}
        onPress={(data, details) => {
          // 'details' is provided when fetchDetails = true
          // console.log(data, details);
          // console.log(details?.geometry.location);
          console.log('address selected');
          console.log(details);
          if (details) {
            setSelectedPlace(details);
            setActive(false);
          }
        }}
        query={{
          key: MAPS_API_KEY,
          language: 'en',
        }}
        onFail={(err) => {
          console.error(err);
        }}
        listEmptyComponent={() => (
          <View style={{ flex: 1 }}>
            <Text>No results were found</Text>
          </View>
        )}
        styles={{
          container: {
            overflow: 'visible',
            // zIndex: 10,
            flexShrink: 0,
            maxHeight: 200,
            zIndex: 10,
            flexGrow: 1,
            minHeight: 100,
          },
          textInput: {
            color: 'black',
          },
        }}
        textInputProps={{
          onChangeText: (newText?: string) => {
            if (newText && newText.length > 0 && !selectedPlace) {
              setActive(true);
            } else {
              setActive(false);
            }
            if (!newText) {
              setSelectedPlace(null);
            }
          },
          placeholderTextColor: 'gray',
        }}
      />
    </View>
  );
}

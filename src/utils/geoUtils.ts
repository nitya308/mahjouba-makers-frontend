import { GooglePlaceDetail, PlaceType } from 'react-native-google-places-autocomplete';
import Address from 'types/address';

export const getAddrComp = (placeDetail: GooglePlaceDetail, compName: PlaceType) => {
  const match = placeDetail.address_components.find((c) => {
    return c.types.includes(compName);
  });
  return match?.long_name || '';
};

export const getStreetAddr = (placeDetail: GooglePlaceDetail): string => getAddrComp(placeDetail, 'street_address');

export const getCity = (placeDetail: GooglePlaceDetail): string => getAddrComp(placeDetail, 'locality');

export const getRegion = (placeDetail: GooglePlaceDetail): string => getAddrComp(placeDetail, 'colloquial_area');

export const getPostalCode = (placeDetail: GooglePlaceDetail): string => getAddrComp(placeDetail, 'postal_code');

export const getCounty = (placeDetail: GooglePlaceDetail): string => getAddrComp(placeDetail, 'sublocality');

export const getCountry = (placeDetail: GooglePlaceDetail): string => getAddrComp(placeDetail, 'country');

export const getGeoPoint = (placeDetail: GooglePlaceDetail) => {
  const { lat, lng } = placeDetail.geometry.location;
  const geo = {
    type: 'Point',
    coordinates: [lat, lng],
  } as {
    type: 'Point';
    coordinates: number[]
  };
  return geo;
};

export const buildAddr = (placeDetail: GooglePlaceDetail): Address => {
  return {
    street: getStreetAddr(placeDetail),
    city: getCity(placeDetail),
    region: getRegion(placeDetail),
    postalCode: getPostalCode(placeDetail),
    county: getCounty(placeDetail),
    country: getCountry(placeDetail),
    geo: getGeoPoint(placeDetail),
    description: placeDetail.formatted_address,
  };
};

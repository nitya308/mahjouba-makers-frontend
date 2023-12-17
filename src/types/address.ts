interface Address {
  _id: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  county: string;
  country: string;
  geo: {
    type: 'Point';
    coordinates: number[];
  },
  description: string;
}

export default Address;

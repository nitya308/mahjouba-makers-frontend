import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import Address from '../types/address';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';

const getAddress = async (_id: string, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  return axios.get<Address>(`${SERVER_URL}addresses/${_id}`)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const createAddress = async (newAddress: Address, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  console.log(newAddress);
  return axios.post<Address & { _id: string }>(`${SERVER_URL}addresses/`, newAddress, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const addressApi = {
  getAddress,
  createAddress,
};

export default addressApi;

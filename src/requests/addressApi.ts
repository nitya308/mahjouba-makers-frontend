import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import Address from 'types/address';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';

const getAddress = async (_id: string, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  return axios.get<Address>(`${SERVER_URL}addresses/${_id}`, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log('error getting address');
      console.log(err);
      throw err;
    });
};

const addressApi = {
  getAddress,
};

export default addressApi;
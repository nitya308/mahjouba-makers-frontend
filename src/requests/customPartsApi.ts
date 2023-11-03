import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import { CustomPart, CustomPartParams } from 'types/customPart';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';

const getCustomPart = async (_id: string, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  return axios.get<CustomPart>(`${SERVER_URL}customParts/${_id}`, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log('error getting part');
      console.log(err);
      throw err;
    });
};

const customPartsApi = {
  getCustomPart,
};

export default customPartsApi;
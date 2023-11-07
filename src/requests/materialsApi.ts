import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import { Material } from 'types/material';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';

const getMaterial = async (_id: string, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  return axios.get<Material>(`${SERVER_URL}materials/${_id}`, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const materialsApi = {
  getMaterial,
};

export default materialsApi;
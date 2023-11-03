import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import { PartType, PartTypeParams } from 'types/part_type';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';

const getPart = async (_id: string, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  return axios.get<PartType>(`${SERVER_URL}partTypes/${_id}`, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log('error getting part');
      console.log(err);
      throw err;
    });
};

const getParts = async (params: PartTypeParams, fbUserRef: User) => {
  let config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  config = {
    ...config,
    params,
  };
  return axios.get<PartType[]>(`${SERVER_URL}partTypes/`, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const updatePart = async (_id: string, params: PartTypeParams, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  return axios.patch<PartType>(`${SERVER_URL}partTypes/${_id}`, params, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const partsApi = {
  getPart,
  getParts,
  updatePart,
};

export default partsApi;

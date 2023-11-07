import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import { CreateUserModel, IUser } from 'types/user';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';
import IMaterial from 'types/material';

const getMaterial = async (_id : string, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  return axios.get<IMaterial>(`${SERVER_URL}materials/${_id}`, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getMaterials = async (fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  return axios.get<IMaterial[]>(`${SERVER_URL}materials/`, config)
    .then((res) => ([ ...res.data ]))
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const searchMaterials = async (idList: string[], fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  const body = { _ids: idList };
  return axios.post<IMaterial[]>(`${SERVER_URL}materials/search`, body, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const materialsApi = {
  getMaterials,
  getMaterial,
  searchMaterials,
};

export default materialsApi;

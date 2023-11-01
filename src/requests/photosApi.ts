import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import Photo from 'types/photo';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';

const getPhoto = async (_id: string, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  return axios.get<Photo>(`${SERVER_URL}photos/${_id}`, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const createPhoto = async (photo: Photo, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  return axios.post<Photo & { _id: string }>(`${SERVER_URL}photos/`, photo, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const photosApi = {
  getPhoto,
  createPhoto,
};

export default photosApi;

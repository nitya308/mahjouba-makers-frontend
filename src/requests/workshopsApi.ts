import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import { Workshop } from 'types/workshop';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';

const getWorkshops = async (fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  return axios.get<Workshop[]>(`${SERVER_URL}workshops`, config)
    .then((res) => {
      console.log('api call return', res.data);
      return res.data as Workshop[];
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getWorkshop = async (id: string, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  return axios.get<Workshop>(`${SERVER_URL}workshops/${id}`, config)
    .then((res) => ({ ...res.data }))
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const createWorkshop = async (newWorkshop: Omit<Workshop, '_id'>, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  return axios.post<Workshop>(`${SERVER_URL}workshops/`, newWorkshop, config)
    .then((res) => ({ ...res.data }))
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const updateWorkshop = async (id: string, updateFields: Partial<Workshop>, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  return axios.patch<Workshop>(`${SERVER_URL}workshops/${id}`, updateFields, config)
    .then((res) => ({ ...res.data }))
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const deleteWorkshop = async (id: string, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  return axios.delete<Workshop>(`${SERVER_URL}workshops/${id}`, config)
    .then((res) => ({ ...res.data }))
    .catch(err => {
      console.log(err);
      throw err;
    });
};


export default {
  getWorkshops,
  getWorkshop,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
};
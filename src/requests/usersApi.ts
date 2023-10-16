import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import { CreateUserModel, IUser } from 'types/user';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';

const initUser = async (userData: CreateUserModel, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  return axios.post<IUser>(`${SERVER_URL}auth/signUp`, userData, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      alert('Unable to initialize user');
      console.log(err);
      throw err;
    });
};

const getCurrUser = async (fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  return axios.get<IUser>(`${SERVER_URL}users/${fbUserRef.uid}`, config)
    .then((res) => ({ ...res.data }))
    .catch((err) => {
      console.log(err);
      // alert('Unable to fetch user');
      throw err;
    });
};

const usersApi = {
  initUser,
  getCurrUser,
};

export default usersApi;

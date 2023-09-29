import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import { IUser } from 'types/users';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';

const initUser = async (userData: Omit<IUser, 'id' | 'role' | 'email'>, fbUserRef: User) => {
  try {
    const config = await getAxiosConfigForFBUser(fbUserRef);
    return await axios.post<IUser>(`${SERVER_URL}/auth/signUp`, userData, config)
      .then((res) => ({ ...res.data }))
      .catch((err) => {
        alert('Unable to initialize user');
        throw err;
      });
  } catch (err) {
    throw err;
  }
};

const usersApi = {
  initUser,
};

export default usersApi;

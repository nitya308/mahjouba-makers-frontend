import { AxiosRequestConfig } from 'axios';
import { User } from 'firebase/auth';

export const getAxiosConfigForFBUser = async (fbUser: User): Promise<AxiosRequestConfig<any> | undefined> => {
  try {
    const token = await fbUser.getIdToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  } catch (err) {
    return undefined;
  }
};

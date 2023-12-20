import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SERVER_URL } from 'utils/constants.js';
import axios from 'axios';
import { UserScopes, IUser, CreateUserModel } from 'types/user.js';
import { User } from 'firebase/auth';
import { usersApi } from 'requests';
import { RootState } from 'redux/store';
import { getPhoto } from './photosSlice';
import { getAddress } from './addressSlice';

export interface UserState {
  loading: boolean;
  userData?: IUser;
}

const initialState: UserState = {
  loading: false,
  userData: undefined,
};

export const initUser = createAsyncThunk(
  'userData/initUser',
  async (req: { userData: CreateUserModel, fbUserRef: User }, { dispatch }) => {
    dispatch(startUsersLoading());
    try {
      const res = await usersApi.initUser(req.userData, req.fbUserRef);
      dispatch(stopUsersLoading());
      dispatch(setUser(res));
      dispatch(getUser({ fbUserRef: req.fbUserRef }));
      return res;
    } catch (err) {
      dispatch(stopUsersLoading());
    } finally {
      dispatch(stopUsersLoading());
    }
  },
);

export const getUser = createAsyncThunk(
  'userData/getUser',
  async (req: { fbUserRef: User }, { dispatch }) => {
    dispatch(startUsersLoading());
    try {
      const res = await usersApi.getCurrUser(req.fbUserRef);
      dispatch(stopUsersLoading());
      if (res) {
        dispatch(setUser(res));
        dispatch(getPhoto({ fbUserRef: req.fbUserRef, photoId: res?.profilePicId ?? '' }));
        dispatch(getAddress({ fbUserRef: req.fbUserRef, addressId: res?.homeAddressId ?? '' }));
      }
      return res;
    } catch (err) {
      dispatch(stopUsersLoading());
    } finally {
      dispatch(stopUsersLoading());
    }
  },
);

export const updateUser = createAsyncThunk(
  'userData/updateUser',
  async (req: { updates: Partial<IUser>, fbUserRef: User }, { dispatch }) => {
    dispatch(startUsersLoading());
    try {
      const res: IUser = await usersApi.updateUser(req.updates, req.fbUserRef);
      if (res && res._id) {
        dispatch(setUser(res));
        dispatch(getPhoto({ fbUserRef: req.fbUserRef, photoId: res?.profilePicId ?? '' }));
        dispatch(getAddress({ fbUserRef: req.fbUserRef, addressId: res?.homeAddressId ?? '' }));
      }
      dispatch(stopUsersLoading());
    } catch (err) {
      dispatch(stopUsersLoading());
      console.log(err);
    }
  },
);

export const deleteUser = createAsyncThunk(
  'userData/deleteUser',
  async (req: { id: string }, { dispatch }) => {
    dispatch(startUsersLoading());
    return axios
      .delete(`${SERVER_URL}users/${req.id}`)
      .finally(() => dispatch(stopUsersLoading()))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error when deleting user', error);
        return false;
      });
  },
);

export const userDataSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      return {
        ...state,
        userData: action.payload,
      };
    },
    startUsersLoading: (state) => ({ ...state, loading: true }),
    stopUsersLoading: (state) => ({ ...state, loading: false }),
    clearUserData: (state) => ({ ...state, userData: undefined, profileImageUri: undefined }),
  },
  extraReducers: (builder) => {
    // builder.addCase(initUser.fulfilled, (state, action) => {
    //   alert('Created user as: ' + JSON.stringify(action.payload));
    // });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.userData = action.payload as IUser;
      // alert('Retrieved user as: ' + JSON.stringify(action.payload));
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      // alert('Updated user to: ' + JSON.stringify(action.payload));
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      const user: IUser = action.payload as IUser;
      const curSelectedUser = state.userData as IUser;
      if (curSelectedUser._id === user._id) {
        state.userData = undefined;
      }
      // alert('Deleted user with id ' + user._id);
    });
  },
});

export const {
  startUsersLoading, 
  stopUsersLoading, 
  setUser, 
  clearUserData,
} = userDataSlice.actions;

export const userDataSelector = (state: RootState) => state.userData;

export default userDataSlice.reducer;

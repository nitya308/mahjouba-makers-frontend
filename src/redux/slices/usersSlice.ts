import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SERVER_URL } from 'utils/constants.js';
import axios from 'axios';
import { UserScopes, IUser } from 'types/users.jsx';

export interface UserState {
  loading: boolean
  selectedUser: IUser | undefined
}

const initialState: UserState = {
  loading: false,
  selectedUser: undefined,
};

export const createUser = createAsyncThunk(
  'users/createUser',
  async (req: { email: string, password: string, name: string }, { dispatch }) => {
    dispatch(startUsersLoading());
    return axios
      .post(`${SERVER_URL}users/`, req)
      .finally(() => dispatch(stopUsersLoading()))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error when creating user', error);
        return false;
      });
  },
);

export const getUser = createAsyncThunk(
  'users/getUser',
  async (req: { id: string }, { dispatch }) => {
    dispatch(startUsersLoading());
    return axios
      .get(`${SERVER_URL}users/${req.id}`)
      .finally(() => dispatch(stopUsersLoading()))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error when getting user', error);
        return false;
      });
  },
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (req: { id: string, email: string, password: string, role: UserScopes }, { dispatch }) => {
    dispatch(startUsersLoading());
    return axios
      .patch(`${SERVER_URL}users/${req.id}`, req)
      .finally(() => dispatch(stopUsersLoading()))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error when updating user', error);
        return false;
      });
  },
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
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

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    startUsersLoading: (state) => ({ ...state, loading: true }),
    stopUsersLoading: (state) => ({ ...state, loading: false }),
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.selectedUser = action.payload as IUser;
      alert('Created user as: ' + JSON.stringify(action.payload));
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.selectedUser = action.payload as IUser;
      alert('Retrieved user as: ' + JSON.stringify(action.payload));
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.selectedUser = action.payload as IUser;
      alert('Updated user to: ' + JSON.stringify(action.payload));
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      const user: IUser = action.payload as IUser;
      const curSelectedUser = state.selectedUser as IUser;
      if (curSelectedUser.id === user.id) {
        state.selectedUser = undefined;
      }
      alert('Deleted user with id ' + user.id);
    });
  },
});

export const { startUsersLoading, stopUsersLoading } =
  usersSlice.actions;

export default usersSlice.reducer;

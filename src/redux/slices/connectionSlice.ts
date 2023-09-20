import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SERVER_URL } from 'utils/constants.js';
import axios from 'axios';

export interface ConnectionState {
  isConnected: boolean // is connected to backend; does not necessarily mean user is logged in
}

const initialState: ConnectionState = {
  isConnected: false,
};

export const checkConnection = createAsyncThunk(
  'connection',
  async () => {
    return axios
      .get<string>(`${SERVER_URL}`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err;
      });
  },
);

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(checkConnection.fulfilled, (state) => {
      state.isConnected = true;
    });
    builder.addCase(checkConnection.rejected, (state) => {
      state.isConnected = false;
    });
  },
});

export default connectionSlice.reducer;

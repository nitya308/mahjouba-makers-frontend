import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SERVER_URL } from '../../utils/constants.js';
import axios from 'axios';
import Address from 'types/address';
import addressApi from 'requests/addressApi';
import { User } from 'firebase/auth';

export interface AddressState {
  loading: boolean
  addressMap: Record<string, Address>
}

const initialState: AddressState = {
  loading: false,
  addressMap: {},
};

export const createAddress = createAsyncThunk(
  'addresss/createAddress',
  async (req: { fbUserRef: User, newAddress: Address }, { dispatch }) => {
    dispatch(startAddressLoading());
    try {
      return await addressApi.createAddress(req.newAddress, req.fbUserRef);
    } catch (err) {
      return null;
    } finally {
      dispatch(stopAddressLoading());
    }
  },
);

export const getAddress = createAsyncThunk(
  'addresss/getAddress',
  async (req: { fbUserRef: User, addressId: string }, { dispatch }) => {
    dispatch(startAddressLoading());
    try {
      return await addressApi.getAddress(req.addressId, req.fbUserRef);
    } catch (err) {
      return null;
    } finally {
      dispatch(stopAddressLoading());
    }
  },
);

export const getAddresses = createAsyncThunk(
  'photos/getPhotos',
  async (req: { fbUserRef: User, addressIds: string[] }, { dispatch }) => {
    await Promise.all(
      req.addressIds.map(async (addressId) => {
        if (addressId) {
          dispatch(getAddress({ fbUserRef: req.fbUserRef, addressId }));
        }
      }),
    );
  },
);


export const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    startAddressLoading: (state) => ({ ...state, loading: true }),
    stopAddressLoading: (state) => ({ ...state, loading: false }),
  },
  extraReducers: (builder) => {
    builder.addCase(createAddress.fulfilled, (state, action) => {
      const address: Address = action.payload as Address;
      if (address && address._id) {
        state.addressMap[address._id] = address;
      }
    });
    builder.addCase(getAddress.fulfilled, (state, action) => {
      const address: Address = action.payload as Address;
      if (address && address._id) {
        state.addressMap[address._id] = address;
      }
    });
  },
});

export const { startAddressLoading, stopAddressLoading } =
  addressSlice.actions;

export default addressSlice.reducer;
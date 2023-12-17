import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SERVER_URL } from '../../utils/constants.js';
import axios from 'axios';
import Photos from 'types/photo';
import photosApi from 'requests/photosApi';
import { User } from 'firebase/auth';

export interface PhotosState {
  loading: boolean
  photosMap: Record<string, Photos>
}

const initialState: PhotosState = {
  loading: false,
  photosMap: {},
};

export const createPhotos = createAsyncThunk(
  'photos/createPhotos',
  async (req: { fbUserRef: User, newPhotos: Photos }, { dispatch }) => {
    dispatch(startPhotosLoading());
    try {
      return await photosApi.createPhoto(req.newPhotos, req.fbUserRef);
    } catch (err) {
      return null;
    } finally {
      dispatch(stopPhotosLoading());
    }
  },
);

export const getPhoto = createAsyncThunk(
  'photos/getPhoto',
  async (req: { fbUserRef: User, photoId: string }, { dispatch }) => {
    dispatch(startPhotosLoading());
    try {
      return await photosApi.getPhoto(req.photoId, req.fbUserRef);
    } catch (err) {
      return null;
    } finally {
      dispatch(stopPhotosLoading());
    }
  },
);

export const getPhotos = createAsyncThunk(
  'photos/getPhotos',
  async (req: { fbUserRef: User, photoIds: string[] }, { dispatch }) => {
    await Promise.all(
      req.photoIds.map(async (photoId) => {
        if (photoId) {
          dispatch(getPhoto({ fbUserRef: req.fbUserRef, photoId }));
        }
      }),
    );
  },
);

export const photosSlice = createSlice({
  name: 'photoses',
  initialState,
  reducers: {
    startPhotosLoading: (state) => ({ ...state, loading: true }),
    stopPhotosLoading: (state) => ({ ...state, loading: false }),
  },
  extraReducers: (builder) => {
    builder.addCase(createPhotos.fulfilled, (state, action) => {
      const photos: Photos = action.payload as Photos;
      if (photos && photos._id) {
        state.photosMap[photos._id] = photos;
      }
    });
    builder.addCase(getPhoto.fulfilled, (state, action) => {
      const photos: Photos = action.payload as Photos;
      if (photos && photos._id) {
        state.photosMap[photos._id] = photos;
      }
    });
  },
});

export const { startPhotosLoading, stopPhotosLoading } =
  photosSlice.actions;

export default photosSlice.reducer;
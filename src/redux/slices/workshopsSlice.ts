import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Workshop } from 'types/workshop';
import workshopsApi from 'requests/workshopsApi';
import { User } from 'firebase/auth';
import { RootState } from 'redux/store';

export interface WorkshopsState {
  workshopsMap: { [id: string]: Workshop };
  loading: boolean;
}

const initialState: WorkshopsState = {
  workshopsMap: {},
  loading: false,
};

export const getWorkshops = createAsyncThunk(
  'workshops/getWorkshops',
  async (req: { fbUserRef: User }, { dispatch }) => {
    dispatch(startWorkshopsLoading());
    try {
      const workshops = await workshopsApi.getWorkshops(req.fbUserRef);
      return workshops;
    } catch (err) {
      return [];
    } finally {
      dispatch(stopWorkshopsLoading());
    }
  },
);
 
export const updateWorkshop = createAsyncThunk(
  'workshops',
  async (req: { id: string, updates: Partial<Workshop>, fbUserRef: User | null }, { dispatch }) => {
    dispatch(startWorkshopsLoading());
    try {
      const res: Workshop = await workshopsApi.updateWorkshop(req.id, req.updates, req.fbUserRef);
      return res;
    } catch (err) {
      return {} as Workshop;
    } finally {
      dispatch(stopWorkshopsLoading());
    }
  },
);

export const workshopsSlice = createSlice({
  name: 'workshops',
  initialState: initialState,
  reducers: {
    startWorkshopsLoading: (state) => {
      state.loading = true;
    },
    stopWorkshopsLoading: (state) => {
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getWorkshops.fulfilled, (state, action) => {
        const workshops: Workshop[] = action.payload;
        workshops.forEach((workshop: Workshop) => {
          state.workshopsMap[workshop._id] = workshop;
        });
      })
      .addCase(updateWorkshop.fulfilled, (state, action) => {
        const updatedWorkshop: Workshop = action.payload;
        state.workshopsMap[updatedWorkshop._id] = updatedWorkshop;
      });
  },
});

export const {
  startWorkshopsLoading,
  stopWorkshopsLoading,
} = workshopsSlice.actions;
export const workshopsSelector = (state: RootState) => state.workshops;

export default workshopsSlice.reducer;
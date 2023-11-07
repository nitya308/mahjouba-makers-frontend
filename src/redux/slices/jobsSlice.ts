import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jobsApi } from 'requests';
import { Job, JobParams, JobUpdateFields } from 'types/job';
import { PartType } from 'types/part_type';
import { Material } from 'types/material';
import { User } from 'firebase/auth';
import { RootState } from 'redux/store';
import CursorContainer from 'types/cursorContainer';
import SortOptions from 'types/sortOptions';
import partsApi from 'requests/partsApi';
import materialsApi from 'requests/materialsApi';

export interface JobState {
  loading: boolean;
  jobs: Job[];
  partsMap: { [id: string]: PartType };
  materialsMap: { [id: string]: Material };
  cursor?: string;
  sortParams?: any;
}

const initialState: JobState = {
  loading: false,
  jobs: [],
  partsMap: {},
  materialsMap: {},
  cursor: undefined,
  sortParams: undefined,
};

export const pullJobs = createAsyncThunk(
  'jobs/pullJobs',
  async (req: { fbUserRef: User, sortOptions?: SortOptions }, { dispatch }) => {
    dispatch(startJobsLoading());
    try {
      const cursorContainer: CursorContainer = {};
      const jobs = await jobsApi.getJobs({}, req.fbUserRef, req.sortOptions, cursorContainer);
      if (jobs) {
        dispatch(setJobs(jobs));
        dispatch(getPartsAndMaterialsForJobs({ fbUserRef: req.fbUserRef }));
        console.log('dispatched');
        dispatch(setCursor(cursorContainer.cursor));
      }
      dispatch(stopJobsLoading());
    } catch (err) {
      dispatch(stopJobsLoading());
    }
  },
);

export const getPartsAndMaterialsForJobs = createAsyncThunk(
  'jobs/getPartsAndMaterialsForJobs',
  async (req: { fbUserRef: User }, { dispatch, getState }) => {
    const { jobs, partsMap } = (getState() as RootState).jobs;
    if (!jobs || jobs.length === 0) return;
    await Promise.all(
      jobs.map(async (j) => {
        if (!j.partTypeId || j.partTypeId in partsMap) return j;
        else {
          try {
            // const dbCustomPart = await customPartsApi.getCustomPart(j.customPartId, req.fbUserRef);
            const dbPart = await partsApi.getPart(j.partTypeId, req.fbUserRef);
            console.log('dbPart', dbPart);
            dispatch(addPart({ part: dbPart, id: j.partTypeId }));

            const materialIds = dbPart.materialIds;
            await Promise.all(
              materialIds.map(async (mId) => {
                const dbMaterial = await materialsApi.getMaterial(mId, req.fbUserRef);
                dispatch(addMaterial({ material: dbMaterial, id: mId }));
              }),
            ); 
            
          } catch (e) {
            console.log(e);
          }
        }
      }),
    );
  });


export const pullNextJobsPage = createAsyncThunk(
  'jobs/pullNextPage',
  async (req: { fbUserRef: User }, { dispatch, getState }) => {
    dispatch(startJobsLoading());
    try {
      const { cursor } = (getState() as RootState).jobs;
      const cursorContainer = { cursor };
      const nextPage = await jobsApi.getJobs({}, req.fbUserRef, undefined, cursorContainer);
      if (nextPage) {
        dispatch(addPage(nextPage));
        dispatch(setCursor(cursorContainer.cursor));
        dispatch(getPartsAndMaterialsForJobs({ fbUserRef: req.fbUserRef }));
      }
      dispatch(stopJobsLoading());
    } catch (err) {
      console.log(err);
      dispatch(stopJobsLoading());
    }
  },
);

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => ({
      ...state,
      jobs: action.payload,
    }),
    setCursor: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      cursor: action.payload,
    }),
    addPage: (state, action: PayloadAction<Job[]>) => ({
      ...state,
      jobs: [
        ...state.jobs,
        ...action.payload.filter((j) => !state.jobs.find((sj) => sj._id === j._id)),
      ],
    }),
    addJob: (state, action: PayloadAction<Job>) => ({
      ...state,
      jobs: [
        ...state.jobs,
        action.payload,
      ],
    }),
    editJob: (state, action: PayloadAction<Job>) => ({
      ...state,
      jobs: state.jobs.map((j) => {
        if (j._id === action.payload._id) {
          return action.payload;
        }
        return j;
      }),
    }),
    deleteJob: (state, action: PayloadAction<string>) => ({
      ...state,
      jobs: state.jobs.filter((j) => j._id === action.payload),
    }),
    startJobsLoading: (state) => ({
      ...state,
      loading: true,
    }),
    stopJobsLoading: (state) => ({
      ...state,
      loading: false,
    }),
    addPart: (state, action: PayloadAction<{ part: PartType, id: string }>) => ({
      ...state,
      partsMap: {
        ...state.partsMap,
        [action.payload.id]: action.payload.part,
      },
    }),
    addMaterial: (state, action: PayloadAction<{ material: Material, id: string }>) => ({
      ...state,
      materialsMap: {
        ...state.materialsMap,
        [action.payload.id]: action.payload.material,
      },
    }),
  },
});

export const { 
  setJobs,
  setCursor,
  addPage,
  addJob,
  editJob,
  deleteJob,
  startJobsLoading,
  stopJobsLoading,
  addPart,
  addMaterial,
} = jobsSlice.actions;
export const jobsSelector = (state: RootState) => state.jobs;

export default jobsSlice.reducer;

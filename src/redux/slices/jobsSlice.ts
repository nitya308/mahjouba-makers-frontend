import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jobsApi } from 'requests';
import { Job, JobParams, JobUpdateFields } from 'types/job';
import PartType from 'types/part_type';
import { User } from 'firebase/auth';
import { RootState } from 'redux/store';
import CursorContainer from 'types/cursorContainer';
import SortOptions from 'types/sortOptions';
import partsApi from 'requests/partsApi';

export interface JobState {
  loading: boolean;
  jobs: Job[];
  partsMap: { [id: string]: PartType };
  cursor?: string;
  sortParams?: any;
}

const initialState: JobState = {
  loading: false,
  jobs: [],
  partsMap: {},
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
        dispatch(getPartsForJobs({ fbUserRef: req.fbUserRef }));
        dispatch(setCursor(cursorContainer.cursor));
      }
      dispatch(stopJobsLoading());
    } catch (err) {
      dispatch(stopJobsLoading());
    }
  },
);

export const getPartsForJobs = createAsyncThunk(
  'jobs/getPartsForJobs',
  async (req: { fbUserRef: User }, { dispatch, getState }) => {
    const { jobs, partsMap } = (getState() as RootState).jobs;
    if (!jobs || jobs.length === 0) return;
    await Promise.all(
      jobs.map(async (j) => {
        if (!j.customPartId || j.customPartId in partsMap) return j;
        else {
          try {
            const dbPart = await partsApi.getPart(j.customPartId, req.fbUserRef);
            dispatch(addPart({ part: dbPart, id: j.customPartId }));
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
        dispatch(getPartsForJobs({ fbUserRef: req.fbUserRef }));
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
} = jobsSlice.actions;
export const jobsSelector = (state: RootState) => state.jobs;

export default jobsSlice.reducer;

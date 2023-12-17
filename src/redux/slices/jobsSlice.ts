import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jobsApi } from 'requests';
import { JOB_STATUS_ENUM, Job, JobParams, JobUpdateFields } from 'types/job';
import { PartType } from 'types/part_type';
import { IMaterial } from 'types/material';
import { User } from 'firebase/auth';
import { RootState } from 'redux/store';
import CursorContainer from 'types/cursorContainer';
import SortOptions from 'types/sortOptions';
import partsApi from 'requests/partsApi';
import materialsApi from 'requests/materialsApi';

export interface JobState {
  loading: boolean;
  jobsMap: { [id: string]: Job };
  partsMap: { [id: string]: PartType };
  materialsMap: { [id: string]: IMaterial };
  currentJobId: string | null;
  jobHistoryIds: string[],
  jobFeedIds: string[],
  cursor?: string;
  sortParams?: any;
}

const initialState: JobState = {
  loading: false,
  jobsMap: {},
  partsMap: {},
  materialsMap: {},
  currentJobId: null,
  jobHistoryIds: [],
  jobFeedIds: [],
  cursor: undefined,
  sortParams: undefined,
};

export const pullJobs = createAsyncThunk(
  'jobs/pullJobs',
  async (req: { fbUserRef: User, sortOptions?: SortOptions }, { dispatch }) => {
    dispatch(startJobsLoading());
    try {
      const cursorContainer: CursorContainer = {};
      const jobs = await jobsApi.getJobs({ jobStatus: JOB_STATUS_ENUM.UNASSIGNED }, req.fbUserRef, req.sortOptions, cursorContainer);
      if (jobs) {
        dispatch(getPartsAndMaterialsForJobs({ jobs, fbUserRef: req.fbUserRef }));
        dispatch(setCursor(cursorContainer.cursor));
      }

      return jobs;
    } catch (err) {
      return [];
    } finally {
      dispatch(stopJobsLoading());
    }
  },
);

export const pullNextJobsPage = createAsyncThunk(
  'jobs/pullNextPage',
  async (req: { fbUserRef: User }, { dispatch, getState }) => {
    dispatch(startJobsLoading());
    try {
      const { cursor } = (getState() as RootState).jobs;
      const cursorContainer = { cursor };
      const jobs = await jobsApi.getJobs({ jobStatus: JOB_STATUS_ENUM.UNASSIGNED }, req.fbUserRef, undefined, cursorContainer);
      if (jobs) {
        dispatch(getPartsAndMaterialsForJobs({ jobs, fbUserRef: req.fbUserRef }));
        dispatch(setCursor(cursorContainer.cursor));
      }

      return jobs;
    } catch (err) {
      return [];
    } finally {
      dispatch(stopJobsLoading());
    }
  },
);

export const getPartsAndMaterialsForJob = createAsyncThunk(
  'jobs/getPartsAndMaterialsForJob',
  async (req: { job: Job, fbUserRef: User }, { dispatch, getState }) => {
    const { partsMap } = (getState() as RootState).jobs;

    if (!req.job.partTypeId || req.job.partTypeId in partsMap) return;
    else {
      try {
        const dbPart = await partsApi.getPart(req.job.partTypeId, req.fbUserRef);
        dispatch(addPart({ part: dbPart, id: req.job.partTypeId }));
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
  });

export const getPartsAndMaterialsForJobs = createAsyncThunk(
  'jobs/getPartsAndMaterialsForJobs',
  async (req: { jobs: Job[], fbUserRef: User }, { dispatch, getState }) => {
    await Promise.all(
      req.jobs.map(async (j) => {
        dispatch(getPartsAndMaterialsForJob({ job: j, fbUserRef: req.fbUserRef }));
      }),
    );
  });

export const getUserJobHistory = createAsyncThunk(
  'jobs/getUserJobHistory',
  async (req: { fbUserRef: User }, { dispatch, getState }) => {
    dispatch(startJobsLoading());
    try {
      const jobs = await jobsApi.getJobHistory(req.fbUserRef);
      if (jobs) {
        dispatch(getPartsAndMaterialsForJobs({ jobs, fbUserRef: req.fbUserRef }));
      }

      return jobs;
    } catch (err) {
      return [];
    } finally {
      dispatch(stopJobsLoading());
    }
  },
);

export const getUserCurrentJob = createAsyncThunk(
  'jobs/getUserCurrentJob',
  async (req: { fbUserRef: User }, { dispatch, getState }) => {
    dispatch(startJobsLoading());
    try {
      const job = await jobsApi.getUserCurrentJob(req.fbUserRef);
      dispatch(getPartsAndMaterialsForJob({ job, fbUserRef: req.fbUserRef }));

      return job;
    } catch (err) {
      return null;
    } finally {
      dispatch(stopJobsLoading());
    }
  },
);

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobFeed: (state) => ({
      ...state,
      jobHistoryIds: [],
    }),
    setCursor: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      cursor: action.payload,
    }),
    addPart: (state, action: PayloadAction<{ part: PartType, id: string }>) => ({
      ...state,
      partsMap: {
        ...state.partsMap,
        [action.payload.id]: action.payload.part,
      },
    }),
    addMaterial: (state, action: PayloadAction<{ material: IMaterial, id: string }>) => ({
      ...state,
      materialsMap: {
        ...state.materialsMap,
        [action.payload.id]: action.payload.material,
      },
    }),
    startJobsLoading: (state) => ({
      ...state,
      loading: true,
    }),
    stopJobsLoading: (state) => ({
      ...state,
      loading: false,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(pullJobs.fulfilled, (state, action) => {
      const jobs: Job[] = action.payload;
      jobs.forEach((job: Job) => {
        state.jobsMap[job._id] = job;
      });
      state.jobFeedIds = [...state.jobFeedIds, ...jobs.map((job: Job) => job._id).filter((jobId: string)=> !state.jobFeedIds.includes(jobId))];
    });
    builder.addCase(pullNextJobsPage.fulfilled, (state, action) => {
      const jobs: Job[] = action.payload;
      jobs.forEach((job: Job) => {
        state.jobsMap[job._id] = job;
      });
      state.jobFeedIds = [...state.jobFeedIds, ...jobs.map((job: Job) => job._id)];
    });
    builder.addCase(getUserJobHistory.fulfilled, (state, action) => {
      const jobs: Job[] = action.payload;
      jobs.forEach((job: Job) => {
        state.jobsMap[job._id] = job;
      });
      state.jobHistoryIds = [...state.jobHistoryIds, ...jobs.map((job: Job) => job._id).filter((jobId: string) => !state.jobHistoryIds.includes(jobId))];
    });
    builder.addCase(getUserCurrentJob.fulfilled, (state, action) => {
      const job: Job | null = action.payload;
      if (job) {
        state.jobsMap[job._id] = job;
        state.currentJobId = job._id;
      } else {
        state.currentJobId = null;
      }
    });
  },
});

export const {
  clearJobFeed,
  setCursor,
  addPart,
  addMaterial,
  startJobsLoading,
  stopJobsLoading,
} = jobsSlice.actions;
export const jobsSelector = (state: RootState) => state.jobs;

export default jobsSlice.reducer;

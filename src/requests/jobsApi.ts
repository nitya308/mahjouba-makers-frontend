import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import { Job, JobParams, JobUpdateFields } from 'types/job';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';
import CursorContainer from 'types/cursorContainer';
import SortOptions from 'types/sortOptions';

const getJobs = async (params: JobParams, fbUserRef: User, sortOptions?: SortOptions, cursorContainer?: CursorContainer) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  config.params = {
    ...params,
    sortOptions,
  };
  if (cursorContainer?.cursor) {
    config.params.cursor = cursorContainer.cursor;
  }
  return axios.get<Job[]>(`${SERVER_URL}jobs`, config)
    .then((res) => {
      if ('cursor' in res.headers && cursorContainer) {
        cursorContainer.cursor = res.headers.cursor;
        console.log(cursorContainer.cursor);
      } else if (cursorContainer) {
        cursorContainer.cursor = undefined;
      }
      return res.data as Job[];
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getJob = async (id: string, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  return axios.get<Job>(`${SERVER_URL}jobs/${id}`, config)
    .then((res) => ({ ...res.data }))
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const createJob = async (newJob: Job, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  return axios.post<Job>(`${SERVER_URL}jobs/`, newJob, config)
    .then((res) => ({ ...res.data }))
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const updateJob = async (id: string, updateFields: JobUpdateFields, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  return axios.patch<Job>(`${SERVER_URL}jobs/${id}`, updateFields, config)
    .then((res) => ({ ...res.data }))
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const deleteJob = async (id: string, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  return axios.delete(`${SERVER_URL}jobs/${id}`, config)
    .then(() => true)
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const jobsApi = {
  getJob,
  getJobs,
  updateJob,
  createJob,
  deleteJob,
};

export default jobsApi;

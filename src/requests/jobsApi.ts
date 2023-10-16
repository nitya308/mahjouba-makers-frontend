import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { User } from 'firebase/auth';
import { Job, JobParams, JobUpdateFields } from 'types/job';
import { getAxiosConfigForFBUser } from 'utils/requestUtils';

const getJobs = async (params: JobParams, fbUserRef: User) => {
  const config = await getAxiosConfigForFBUser(fbUserRef);
  if (!config) throw new Error('Unable to create auth config');
  config.params = params;
  return axios.get<Job[]>(`${SERVER_URL}jobs`, config)
    .then((res) => (res.data as Job[]))
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

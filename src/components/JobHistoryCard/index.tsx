import useAppSelector from 'hooks/useAppSelector';
import React, { useState, useEffect } from 'react';
import { authSelector } from 'redux/slices/authSlice';
import { jobsSelector } from 'redux/slices/jobsSlice';
import { jobsApi, partsApi } from 'requests';
import { Job } from 'types/job';
import { PartType } from 'types/part_type';

export default function JobHistoryCard({
  jobId,
}: {
  jobId: string;
}): JSX.Element {
  const { fbUserRef } = useAppSelector(authSelector);
  const { partsMap } = useAppSelector(jobsSelector);

  const [job, setJob] = useState<Job | undefined>(undefined);
  const [partType, setPartType] = useState<PartType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) return;
    const pullJob = async () => {
      if (!fbUserRef) return;
      setLoading(true);
      try {
        const dbJob = await jobsApi.getJob(jobId, fbUserRef);
        if (dbJob) {
          setJob(dbJob);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    pullJob();
  }, [jobId, fbUserRef]);

  useEffect(() => {
    if (!job || partType) return;
    const pullPartType = async () => {
      if (!fbUserRef) return;
      setLoading(true);
      try {
        await partsApi.getPart(job.partTypeId, fbUserRef);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    if (job.partTypeId in partsMap) {
      setPartType(partsMap[job.partTypeId]);
    } else {
      pullPartType();
    }
  }, [job, fbUserRef]);

  return <></>;
}
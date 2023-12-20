export interface Job {
  _id: string,
  price: number,
  dropoffAddressId: string,
  imageIds: string[],
  userId: string,
  partTypeId: string,
  jobStatus: string,
  qrCode: string;
  dueDate: Date,
}

export interface JobUpdateFields {
  price?: number;
  dropoffAddressId?: string;
  imageIds?: string[];
  userId?: string;
  partTypeId?: string;
  jobStatus?: string;
  qrCode?: string;
  dueDate?: Date;
}

export interface JobParams {
  _id?: string;
  price?: number;
  dropoffAddressId?: string;
  imageIds?: string[];
  userId?: string;
  partTypeId?: string;
  jobStatus?: string;
  qrCode?: string;
  dueDate?: Date;
}

export const JOB_STATUS_ENUM = {
  UNASSIGNED: 'Unassigned',
  INCOMPLETE: 'Incomplete',
  PENDING_REVIEW: 'Pending Review',
  COMPLETE: 'Complete',
};
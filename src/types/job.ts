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
  price?: number;
  dropoffAddressId?: string;
  imageIds?: string[];
  userId?: string;
  partTypeId?: string;
  jobStatus?: string;
  qrCode?: string;
  dueDate?: Date;
}

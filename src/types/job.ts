export interface Job {
  _id: string,
  price: number,
  dropoffAddressId: string,
  instructions: string,
  imageIds: string[],
  userId: string,
  partId: string,
  dueDate: Date,
}

export interface JobUpdateFields {
  price?: number,
  dropoffAddressId?: string,
  instructions?: string,
  imageIds?: string[],
  userId?: string,
  partId?: string,
  dueDate?: Date,
}

export interface JobParams {
  _id?: string;
  price?: number;
  dropoffAddressId?: string;
  instructions?: string;
  imageIds?: string[];
  userId?: string;
  partId?: string;
  dueDate?: Date;
}

export interface Workshop {
  _id: string;
  name: string;
  description: string;
  location: string;
  workshopTime: Date;
  instructor: string;
  capacity: number;
  participantIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
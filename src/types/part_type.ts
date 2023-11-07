export interface PartType {
  _id: string;
  name: string;
  description: string;
  payout: number;
  instructions: string;
  imageIds: string[];
  completionTime: number;
  materialIds: string[];
}

export interface PartTypeParams {
  name?: string;
  description?: string;
  payout?: number;
  instructions?: string;
  imageIds?: string[];
  completionTime?: number;
  materialIds: string[];
}

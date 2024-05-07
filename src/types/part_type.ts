export interface PartType {
  _id: string;
  name: string;
  description: string;
  payout: number;
  instructions: string;
  instructionImageIds: string[];
  mainImageId: string;
  completionTime: number;
  materialIds: string[];
}

export interface PartTypeParams {
  name?: string;
  description?: string;
  payout?: number;
  instructions?: string;
  instructionImageIds?: string[];
  mainImageId?: string;
  completionTime?: number;
  materialIds?: string[];
}

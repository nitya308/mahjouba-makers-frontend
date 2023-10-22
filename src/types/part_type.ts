export default interface PartType {
  _id: string;
  name: string;
  description: string;
}

export interface PartTypeParams {
  name?: string;
  description?: string;
}

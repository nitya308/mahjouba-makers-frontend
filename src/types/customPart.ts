export interface CustomPart {
  _id: string;
  qrCode: string;
  partTypeId: string;
}

export interface CustomPartParams {
  qrCode?: string;
  partTypeId?: string;
}

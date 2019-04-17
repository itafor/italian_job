export class FileI {
  secret: SecretI;
  _id: string;
  userId: string;
  tenantId: string;
  nameHash: string;
  createdAt: Date;
  updatedAt?: Date;
  __v?: number;
}
export class FileResponseI {
  data: FileI[];
  status: string;
  error: any;
}
export class SecretI {
  originalFileName: string;
  fileName: string;
  fileSize: number;
  fileExtension: string;
  sharing?: any[];
}

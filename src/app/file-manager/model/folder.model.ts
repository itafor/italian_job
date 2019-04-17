export class FolderI {
    secret: SecretI;
    _id: string;
    createdAt: Date;
    updatedAt?: Date;
}
export class SecretI {
    folderName: string;
}


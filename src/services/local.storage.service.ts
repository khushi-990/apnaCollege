import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalStorageService{
    constructor() {}

    // async uploadFile(folderName: string, fileName: string, file)
    async createCommon(params,modalName) {

        return await modalName.create(params);
      }
}
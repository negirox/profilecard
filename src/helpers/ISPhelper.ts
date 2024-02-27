import { UserMasterResponse } from "../model/SPResponse";

export interface ISPHelper {
    getListData(url: string):any;
    getUserMaster(props: any, email: string, noofRecords: number): Promise<UserMasterResponse>
}
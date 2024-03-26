import { UserMaster } from "../../../model/SPResponse";

export interface IProfileCardState{
    UserData:UserMaster;
    loading:boolean;
    isAnniversary:boolean;
    isBirthday:boolean;
    birthdays:UserMaster[];
    anniverSaries:UserMaster[];
    newJoiners:UserMaster[];
}
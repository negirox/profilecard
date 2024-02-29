import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IProfilecardProps {
  applicationlistName: string;
  userApplicationlistName: string;
  adminUserlistName:string;
  userMasterList:string;
  webpartContext:WebPartContext;
  defaultBackgroundImage:string;
  defaultbirthdayimage:string;
  defaultannivarsaryimage:string;
}

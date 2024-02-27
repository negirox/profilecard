import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'ProfilecardWebPartStrings';
import Profilecard from './components/Profilecard';
import { IProfilecardProps } from './components/IProfilecardProps';
import { IODataList } from '@microsoft/sp-odata-types';
import { ISPHelper } from '../../helpers/ISPhelper';
import { SPHelpers } from '../../helpers/SPhelpers';
import { ListNames } from '../../model/SPConstants';
export interface IProfilecardWebPartProps {
  applicationlistName: string;
  userApplicationlistName: string;
  adminUserlistName: string;
  userMasterList: string;
}

export default class ProfilecardWebPart extends BaseClientSideWebPart<IProfilecardWebPartProps> {
  private dropdownOptions: IPropertyPaneDropdownOption[];
  private spHelper:ISPHelper;
  public render(): void {
    const element: React.ReactElement<IProfilecardProps> = React.createElement(
      Profilecard,
      {
        applicationlistName: this.properties.applicationlistName ?? ListNames.Applications,
        userApplicationlistName: this.properties.userApplicationlistName ?? ListNames.UserApplications,
        adminUserlistName: this.properties.adminUserlistName ?? ListNames.AdminConfiguration,
        userMasterList: this.properties.userMasterList ?? ListNames.UserMaster,
        webpartContext: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    this.spHelper = new SPHelpers(this.context.spHttpClient);
    const options = await this.fetchOptions();
    this.dropdownOptions = options;
  }



  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  private async fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    const url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$select=Title,Id&$filter=Hidden eq false`;
    const response = await this.spHelper.getListData(url);
    const options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
    response.value.map((list: IODataList) => {
      options.push({ key: list.Title, text: list.Title });
    });
    return options;
  }
  protected onPropertyPaneConfigurationStart(): void {

  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (newValue) {
      switch (propertyPath) {
        case 'applicationlistName': this.properties.applicationlistName = newValue; break;
        case 'userApplicationlistName': this.properties.userApplicationlistName = newValue; break;
        case 'adminUserlistName': this.properties.adminUserlistName = newValue; break;
        case 'userMasterList': this.properties.userMasterList = newValue; break;
      }
      // push new list value
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
      // refresh the item selector control by repainting the property pane
      this.context.propertyPane.refresh();
      // re-render the web part as clearing the loading indicator removes the web part body
      this.render();
    }
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('userMasterList', {
                  label: 'Select User Master list',
                  options: [...this.dropdownOptions]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

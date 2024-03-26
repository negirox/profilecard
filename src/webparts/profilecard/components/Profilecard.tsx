import * as React from 'react';
import styles from './Profilecard.module.scss';
import { IProfilecardProps } from './IProfilecardProps';
import { IProfileCardState } from './IProfileCardState';
import { ISPHelper } from '../../../helpers/ISPhelper';
import { SPHelpers } from '../../../helpers/SPhelpers';
import { UserMaster, UserMasterResponse, UserProfileProps } from '../../../model/SPResponse';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
//import './../../../fonts/font-stylesheet.module.scss';
export default class Profilecard extends React.Component<IProfilecardProps, IProfileCardState> {
  private _spHelper: ISPHelper;
  constructor(props: IProfilecardProps) {
    super(props);
    this.state = {
      UserData: null,
      loading: true,
      isAnniversary: false,
      isBirthday: false,
      anniverSaries:[],
      birthdays:[],
      newJoiners:[]
    }
    this._spHelper = new SPHelpers(this.props.webpartContext.spHttpClient);
  }
  async componentDidMount(): Promise<void> {
    const userMasterData: UserMasterResponse = await this._spHelper.getUserMaster(this.props, this.props.webpartContext.pageContext.user.email, 1);
    console.log(userMasterData);
    const userPropertiesURL = this.props.webpartContext.pageContext.web.absoluteUrl + `/_api/SP.UserProfiles.PeopleManager/GetMyProperties`;
    const userProperties:UserProfileProps = await this._spHelper.getListData(userPropertiesURL);
    console.log(userProperties);
    this.RenderUserData(userMasterData);
  }
  private RenderUserData(userMasterData: UserMasterResponse): void {
    if (userMasterData.value.length > 0) {
      const respo: UserMaster = userMasterData.value[0];

      const isAnniversary = this.CheckDate(respo.DateOfJoining);
      const isBirthday = this.CheckDate(respo.DateOfBirth);

      this.setState({
        UserData: respo,
        loading: false,
        isAnniversary: isAnniversary === isBirthday ? false : isAnniversary,//prefer birthday
        isBirthday: isBirthday
      })
    }
  }
  private CheckDate(date: string): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return (d.getDate() === currentDate.getDate()) && (d.getMonth() === currentDate.getMonth());
  }
  public render(): React.ReactElement<IProfilecardProps> {
    const user = this.state.UserData;
    const photo: string = `/_layouts/15/userphoto.aspx?size=L&accountname=${user?.UserEmail}`;
    const currentSite = this.props.webpartContext.pageContext.web.absoluteUrl;
    let celebrationURL = this.props.defaultBackgroundImage ?? `${currentSite}/SiteAssets/ADPorts/profilecard/Blank.png`;
    if (this.state.isBirthday) {
      celebrationURL = this.props.defaultbirthdayimage ?? `${currentSite}/SiteAssets/ADPorts/profilecard/birthday.png`
    }
    else if (this.state.isAnniversary) {
      celebrationURL = this.props.defaultannivarsaryimage ?? `${currentSite}/SiteAssets/ADPorts/profilecard/Anniversary.png`
    }
    console.log(celebrationURL);
    return (
      <section>
        <h3>Profile</h3>
        {
          this.state.loading &&
          <Spinner label="Loading users..." size={SpinnerSize.large} />
        }
        {!this.state.loading && <div className={styles.mainDiv} style={{ backgroundImage: `url('${celebrationURL}')` }}>
          <div className={styles.firstDiv} />
          <div className={styles.secondDiv} />
          <div className={styles.thirdDiv}>
            <div className={styles.fourthDiv} />
            <div className={styles.fifthDiv} />
            <div className={styles.sixthDiv}>
              <img className={styles.profilePic} src={photo} />
            </div>
          </div>
          <div className={styles.seventhDiv} style={{ display: this.state.isAnniversary ? 'block' : 'none' }}>Happy Work Anniversary!</div>
          <div className={styles.seventhDiv} style={{ display: this.state.isBirthday ? 'block' : 'none' }}>Happy Birthday!</div>
          <div className={styles.seventhDiv} style={{ display: !(this.state.isBirthday || this.state.isAnniversary) ? 'block' : 'none' }}>
            {user.UserFullName}
          </div>
          <div className={styles.eigthDiv} style={{ display: (this.state.isBirthday || this.state.isAnniversary) ? 'block' : 'none' }}>
            {user.UserFullName}
          </div>
          <div className={styles.eigthDiv} style={{ display: !(this.state.isBirthday || this.state.isAnniversary) ? 'block' : 'none' }}>
            {user.JobTitle}
          </div>
          <div className={styles.nineDiv}>
            <div className={styles.tenDiv}>
              <div className={styles.elevenDiv}>
                <div className={styles.twelveDiv}>
                  <div className={styles.fourteenDiv}>
                    <img className={styles.arrowFill} src={`${currentSite}/SiteAssets/ADPorts/profilecard/intime.png`} />
                  </div>
                </div>
                <div className={styles.fifteenDiv}>IN-TIME</div>
              </div>
              <div className={styles.sixteenDiv}>07:00 AM</div>
              <div className={styles.seventeenDiv}>Swiped at Kezad</div>
            </div>
            <div className={styles.eighteenDiv} />
            <div className={styles.nineteenDiv}>
              <div className={styles.twentyDiv}>
                <div className={styles.twentyoneDiv}>{user.UserCluster}</div>
                <div className={styles.twentytwoDiv}>
                  <img className={styles.arrowFill} src={`${currentSite}/SiteAssets/ADPorts/profilecard/rightarrow.png`} />
                </div>
              </div>
            </div>
          </div>

        </div>
        }
      </section>
    );
  }
}

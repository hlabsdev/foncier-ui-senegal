import { HslaBrand } from '@app/core/models/branding/hsla-brand';
import { QuicklinksGroup } from '@features/quicklink/models/quicklink.model';
export class ApplicationPreferences {
  appPrefsId: string;
  orgName: string;
  orgWebsite: string;
  orgVisualIdentity: string;
  appSliderVisual_1: string;
  appSliderVisual_2: string;
  appSliderVisual_3: string;
  saveQuicklinksValue: boolean;
  quicklinksGroups: QuicklinksGroup[];
  orgMainColor: HslaBrand;
  appMyTasksButtonColor: HslaBrand;
  appClaimsButtonColor: HslaBrand;
  appAllTasksButtonColor: HslaBrand;

  constructor(obj: any = {}) {
    this.appPrefsId = obj.appPrefsId;
    this.orgName = obj.orgName;
    this.orgWebsite = obj.orgWebsite;
    this.orgVisualIdentity = obj.orgVisualIdentity;
    this.appSliderVisual_1 = obj.appSliderVisual_1;
    this.appSliderVisual_2 = obj.appSliderVisual_2;
    this.appSliderVisual_3 = obj.appSliderVisual_3;
    this.saveQuicklinksValue = obj.saveQuicklinksValue;
    this.quicklinksGroups = obj.quicklinksGroups;
    this.orgMainColor = obj.orgMainColor;
    this.appMyTasksButtonColor = obj.appMyTasksButtonColor;
    this.appClaimsButtonColor = obj.appClaimsButtonColor;
    this.appAllTasksButtonColor = obj.appAllTasksButtonColor;
  }
}

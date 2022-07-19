import { BAUnit } from '@app/workstation/baUnit/baUnit.model';

export class Fusion {
  id: number;
  isNewTitleForFusion: boolean;
  isTotalFusion: boolean;
  landTitleList: BAUnit[];
  titleNames: string;
  constructor(obj: any = {}) {
    this.id = obj.id;
    this.isNewTitleForFusion = obj.isNewTitleForFusion ? obj.isNewTitleForFusion : false;
    this.isTotalFusion = obj.isTotalFusion ? obj.isTotalFusion : false;
    this.landTitleList = obj.landTitleList ? obj.landTitleList : [];
    this.titleNames = obj.titleNames;
  }
}

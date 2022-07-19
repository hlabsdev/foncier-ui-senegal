import { CodeList } from '@app/core/models/codeList.model';
import Utils from '@app/core/utils/utils';
import { SpatialUnit } from './spatialUnit.model';

export class Level {

  id: String;
  lid: String;
  name: String;
  type: CodeList;
  structure: CodeList;
  registerType: CodeList;
  spatialUnits: SpatialUnit[] = [];
  modDate: Date;
  modUser: String;

  constructor(obj: any = {}) {
    this.id = obj.id;
    this.lid = obj.lid;
    this.name = obj.name;
    this.type = obj.type;
    this.structure = obj.structure;
    this.registerType = obj.registerType;
    // this.spatialUnits = obj.spatialUnits ? obj.spatialUnits.map(su => Utils.manageSpatialUnitPolymorphism(su)) : [];
    this.modDate = Utils.setDate(obj.modDate);
    this.modUser = obj.modUser;

  }

}

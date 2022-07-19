import { RRR } from '../rrr.model';
import { CodeList } from '@app/core/models/codeList.model';
import { ResponsibilityType } from '../responsibilityType.model';

export class Responsibility extends RRR {
  type: CodeList;
  responsibilityType: ResponsibilityType;

  constructor(obj: any = {}) {
    super(obj);
    this.type = obj.type;
    this.responsibilityType = obj.responsibilityType;
  }
}

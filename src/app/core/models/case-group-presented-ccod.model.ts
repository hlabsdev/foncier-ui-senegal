
import { CasePresentedCcod } from '@app/core/models/case-presented-ccod.model';

export class CaseGroupPresentedCcod {

  id: string;
  caseNumber: string;
  reference: string;
  designation: string;
  caseType: string;
  category: string;
  csf: string;
  createdDate: string;
  status: string;
  cases: Array<CasePresentedCcod>;

  constructor(obj: any = {}) {
    this.id = obj.id;
    this.createdDate = obj.createdDate;
    this.cases = obj.cases;
    this.status = obj.status;
    this.caseNumber = obj.caseNumber;
    this.reference = obj.reference;
    this.designation = obj.designation;
    this.caseType = obj.caseType;
    this.category = obj.category;
    this.csf = obj.csf;
  }

}

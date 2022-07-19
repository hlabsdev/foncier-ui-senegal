
import Utils from '../utils/utils';
import { Application } from './application.model';

export class Delegation {

  id: string;
  startDate: Date;
  status: string;
  motif: string;
  endDate: Date;

  constructor(obj: any = {}) {
    this.id = obj.id;
    this.startDate = obj.startDate;
    this.status = obj.status;
    this.motif = obj.motif;
    this.endDate = obj.endDate;
  }
}

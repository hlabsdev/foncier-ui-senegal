
import Utils from '../utils/utils';
import { Application } from './application.model';

export class CasePresentedCcod {

  id: string;
  depositDate: Date;
  application: Application;

  constructor(obj: any = {}) {
    this.id = obj.id;
    this.depositDate = Utils.setDate(obj.depositDate);
    this.application = obj.application ? new Application(obj.application) : new Application();
  }
}

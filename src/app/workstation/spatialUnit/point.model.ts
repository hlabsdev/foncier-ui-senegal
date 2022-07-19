import Utils from '@app/core/utils/utils';

export class Point {

  id: String;
  pid: String;
  modDate: Date;
  modUser: String;

  constructor(obj: any = {}) {
    this.id = obj.id;
    this.pid = obj.pid;
    this.modDate = Utils.setDate(obj.modDate);
    this.modUser = obj.modUser;

  }

}

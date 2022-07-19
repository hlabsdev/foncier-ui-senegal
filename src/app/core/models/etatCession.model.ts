export class EtatCession {
  id: number;
  TOTALSIMPLE: number;
  TOTALFULL: number;
  constructor(obj: any = {}) {
    this.TOTALSIMPLE = obj.TOTALSIMPLE;
    this.TOTALFULL = obj.TOTALFULL;
  }
}

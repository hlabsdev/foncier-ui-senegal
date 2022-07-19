import { Selectable } from '@app/core/interfaces/selectable.interface';
import { SelectItem } from 'primeng';

export class TaxPayerType implements Selectable {

  id: number;
  taxPayerType: string;

  constructor(obj: any = {}) {
    this.id = obj.id;
    this.taxPayerType = obj.description;
  }

  toSelectItem(): SelectItem {
    return {
      label: this.taxPayerType,
      value: this.id,
    };
  }
}

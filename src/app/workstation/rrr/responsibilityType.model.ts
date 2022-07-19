import { SelectItem } from 'primeng';
import { Selectable } from '../../core/interfaces/selectable.interface';

export class ResponsibilityType implements Selectable {
  value: ResponsibilityTypeEnum;

  constructor(value: ResponsibilityTypeEnum) {
    this.value = value;
  }

  toSelectItem(): SelectItem {
    return {
      label: this.value,
      value: this.value
    };
  }
}

export type ResponsibilityTypeEnum = 'MONETARY' | 'OTHERS';

export const ResponsibilityTypes = {
  MONETARY: 'MONETARY' as ResponsibilityTypeEnum,
  OTHERS: 'OTHERS' as ResponsibilityTypeEnum
};

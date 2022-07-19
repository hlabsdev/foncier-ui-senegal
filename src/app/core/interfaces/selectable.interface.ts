import { SelectItem } from 'primeng';

export interface Selectable {
    toSelectItem(): SelectItem;
}

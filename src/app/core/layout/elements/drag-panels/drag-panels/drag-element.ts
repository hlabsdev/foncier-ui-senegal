export class DragElement<T> {
  base: T;
  dragDisabled: boolean;
  showMoreInfos: boolean;
  isRemovable: boolean;

  constructor(obj: T, disabled?: boolean | Boolean) {
    this.base = obj;
    this.dragDisabled = !!disabled;
  }
}

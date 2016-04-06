
export class SelectableItem {
  private _isSelected : boolean;
  get isSelected() {
    return !!this._isSelected;
  }
  set isSelected(val : boolean) {
    this._isSelected = val;
  }
  constructor() {
    this._isSelected = false;
  }
}

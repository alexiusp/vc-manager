
export class SelectableItem {
  private _isSelected : boolean;
  get isSelected() {
    return !!this._isSelected;
  }
  set isSelected(val : boolean) {
    this._isSelected = !!val;
  }
  constructor() {
    this._isSelected = false;
  }
}

export class LoadableItem extends SelectableItem {
  private _loading;
  get isLoading() {
    return !!this._loading;
  }
  set isLoading(val : boolean) {
    this._loading = !!val;
  }
  constructor() {
    super();
    this._loading = true;
  }
}

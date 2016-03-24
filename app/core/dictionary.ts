export type mapIndex = string | number;

export class map<T> {
  [index : number] : T;
  [key : string] : T;
}

export class Dictionary<T> {
  constructor() {
    this.keys = [];
    this.values = [];
    this._data = {};
  }
  private lastIndex : number;
  private keys : Array<string|number>
  getKeys() : Array<string|number> {
    return this.keys;
  }
  hasKey(key:string) : boolean {
    return (this.keys.indexOf(key) > -1);
  }
  private values : Array<T>
  getValues() : Array<T> {
    return this.values;
  }
  private _data : map<T>;
  setValue(key:string|number, value:T) {
    this.removeValue(key);
    this.keys.push(key);
    this.values.push(value);
    this.lastIndex = this.keys.length;
    this._data[key] = value;
  }
  removeValue(key:string|number) {
    var i : number = this.keys.indexOf(key);
    if(i > -1) {
      this.keys.splice(i,1);
      this.values.splice(i,1);
    }
  }
}

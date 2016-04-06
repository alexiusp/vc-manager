export type mapIndex = string | number;

export class map<T> {
  [index : number] : T;
  [key : string] : T;
}

export class Dictionary<T> {
  constructor() {
    this.keys = [];
    this.values = [];
  }
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
  setValue(key:string|number, value:T) {
    this.removeValue(key);
    this.keys.push(key);
    this.values.push(value);
  }
  removeValue(key:string|number) {
    let i : number = this.keys.indexOf(key);
    if(i > -1) {
      this.keys.splice(i,1);
      this.values.splice(i,1);
    }
  }
  get(key:string|number) : T {
    let i : number = this.keys.indexOf(key);
    if(i >= 0) return this.values[i];
    else return null;
  }
}

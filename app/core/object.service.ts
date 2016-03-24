import {Injectable} from 'angular2/core';
import {map, Dictionary} from './dictionary';

@Injectable()
export class ObjectService {
  constructor () {}
  private _data : Dictionary<map<any>>;
  setDict(name:string, dict: map<any>) {
    this._data[name] = dict;
  }
}

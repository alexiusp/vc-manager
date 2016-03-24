import {Injectable} from 'angular2/core';

@Injectable()
export class StorageService {
  _ls : Storage;
  constructor() {
    this._ls = window.localStorage;
  }
  loadData(key: string) {
    return JSON.parse(this._ls.getItem(key));
  }
  saveData(key: string, data: any) {
    this._ls.setItem(key, JSON.stringify(data));
  }
  getHeroes() {
    //return Promise.resolve(HEROES);
  }
  getHero(id: number) {
    /*
    return Promise.resolve(HEROES).then(
      heroes => heroes.filter(hero => hero.id === id)[0]
    );*/
  }
}

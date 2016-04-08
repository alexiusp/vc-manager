import { Injectable } from 'angular2/core';
import {Observable}     from 'rxjs/Observable';

// services
import { RequestService } from '../request/request.service';

// models
import { ResponseWrapper, ResultMessage } from '../request/response';
import { Corporation, CorpInfo, CompanyDetail } from './contracts';
import { BaseStorageElement } from './storage/contracts';
import { Dictionary, map } from '../core/dictionary';

@Injectable()
export class CorporationService {
  constructor (
    private _requestService : RequestService
  ) {
    this._corps = new map<CorpInfo>();
  }
  private _corpList : Corporation[];
  private _corps : map<CorpInfo>;
  private _corpStorage : map<BaseStorageElement[]>;
  getCorpsList() {
    return this._requestService.getCorpsList().map((corpList : ResponseWrapper<Corporation[]>) => {
      if(corpList.error == 0) {
        let l = corpList.data;
        this._corpList = l;
        //console.log("corporation list:", l);
        return l
      } else return this.handleError(corpList);
    });
  }
  getCorporation(id : number) {
    //console.log("getCorporation", id);
    let corp : Corporation;
    if(!!this._corpList) {
      for(let c of this._corpList) if(c.id == id) corp = c;
    } else console.error("Corporation list is undefined or empty", id, JSON.stringify(this._corpList), corp);
    //console.log("corp", corp);
    return corp;
  }
  getCorpDetail(id : number) {
    let pId = `${id}`;
    return this._requestService.getCorpDetail(id)
      .map((corpInfo : ResponseWrapper<CorpInfo>) => {
        if(corpInfo.error == 0) {
          this._corps[pId] = corpInfo.data;
          return this._corps[pId]
        } else return this.handleError(corpInfo);
      });
  }
  getCorpStorage(id : number) {
    let pId = `${id}`;
    if(!this._corpStorage) this._corpStorage = new map<BaseStorageElement[]>();
    return this._requestService.getCorpStorage(id)
      .map((cStorage : ResponseWrapper<BaseStorageElement[]>) => {
        if(cStorage.error == 0) {
          let _resStorage = cStorage.data;
          this._corpStorage[pId] = _resStorage;
          return _resStorage;
        } else return this.handleError(cStorage);
      });
  }
  getCompanyStorage(id : number) {
    return this._requestService.getCompanyStorage(id)
      .map((cStorage : ResponseWrapper<BaseStorageElement[]>) => {
        if(cStorage.error == 0) return cStorage.data;
        else return this.handleError(cStorage);
      });
  }
  getCompanyDetail(id : number) {
    return this._requestService.getCompanyDetail(id)
      .map((cDetail : ResponseWrapper<CompanyDetail>) => {
        if(cDetail.error == 0) return cDetail.data;
        else return this.handleError(cDetail);
      });
  }
  moveItemToCorporation(compId, itemId, amount) {
    return this._requestService.moveItemToCorporation(compId, itemId, amount)
      .map((result : ResponseWrapper<ResultMessage[]>) => {
        if(result.error == 0) return result.data;
        else return this.handleError(result);
      });
  }
  addFundsToCompany(compId, amount) {
    return this._requestService.addFundsToCompany(compId, amount)
      .map((result : ResponseWrapper<ResultMessage[]>) => {
        if(result.error == 0) return result.data;
        else return this.handleError(result);
      });
  }
	addFundsToCorporation(corpId, amount) {
    return this._requestService.addFundsToCorporation(corpId, amount)
      .map((result : ResponseWrapper<ResultMessage[]>) => {
        if(result.error == 0) return result.data;
        else return this.handleError(result);
      });
  }
	moveItemsToCompany(compId, items) {
    return this._requestService.moveItemsToCompany(compId, items)
      .map((result : ResponseWrapper<ResultMessage[]>) => {
        if(result.error == 0) return result.data;
        else return this.handleError(result);
      });
  }
  sellItemFromCorporation(corpId, itemId, amount, price) {
    console.log("debugging request:", this._requestService, corpId, itemId, amount, price);
    return this._requestService.sellItemFromCorporation(corpId, itemId, amount, price)
      .map((result : ResponseWrapper<ResultMessage[]>) => {
        if(result.error == 0) return result.data;
        else return this.handleError(result);
      });
  }
  sellItemFromCompany(compId, itemId, amount, price) {
    return this._requestService.sellItemFromCompany(compId, itemId, amount, price)
      .map((result : ResponseWrapper<ResultMessage[]>) => {
        if(result.error == 0) return result.data;
        else return this.handleError(result);
      });
  }
  handleError(error : ResponseWrapper<any>) {
    //console.error("Error:",error.message);
    return error.data;
  }
}

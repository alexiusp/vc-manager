import { Injectable } from 'angular2/core';
import { Router } from 'angular2/router';
// services
import { RequestService } from '../request/request.service';

// models
import { ResponseWrapper, ResultMessage } from '../request/response';
import { Corporation, CorpInfo, CorporationStorageElement, CompanyStorageElement, CompanyDetail } from './corporation';
import { Dictionary, map } from '../core/dictionary';

@Injectable()
export class CorporationService {
  constructor (
    private _requestService : RequestService,
		private _router : Router
  ) {
    this._corps = new map<CorpInfo>();
    this._corpStorage = new map<CorporationStorageElement[]>();
  }
  private _corpList : Corporation[];
  private _corps : map<CorpInfo>;
  private _corpStorage : map<CorporationStorageElement[]>;
  getCorpsList() {
    return this._requestService.getCorpsList().map((corpList : ResponseWrapper<Corporation[]>) => {
      if(corpList.error == 0) {
        this._corpList = corpList.data;
        return this._corpList
      } else return this.handleError(corpList);
    });
  }
  getCorpDetail(id : number) {
    return this._requestService.getCorpDetail(id)
      .map((corpInfo : ResponseWrapper<CorpInfo>) => {
        if(corpInfo.error == 0) {
          this._corps[`${id}`] = corpInfo.data;
          return this._corps[`${id}`]
        } else return this.handleError(corpInfo);
      });
  }
  getCorpStorage(id : number) {
    return this._requestService.getCorpStorage(id)
      .map((cStorage : ResponseWrapper<CorporationStorageElement[]>) => {
        if(cStorage.error == 0) {
          let _resStorage = cStorage.data;
          this._corpStorage[`${id}`] = _resStorage;
          return _resStorage;
        } else return this.handleError(cStorage);
      });
  }
  getCompanyStorage(id : number) {
    return this._requestService.getCompanyStorage(id)
      .map((cStorage : ResponseWrapper<CompanyStorageElement[]>) => {
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
  handleError(error : ResponseWrapper<any>) {
    console.error("Error:",error.message);
		if(error.error == 1) this._router.navigateByUrl('/');
    return error.data;
  }
}

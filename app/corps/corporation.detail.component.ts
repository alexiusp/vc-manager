import { Component, OnInit } from 'angular2/core';
import { RouteParams, Router } from 'angular2/router';

import { CorpInfo, CorporationStorageElement, Company, CompanyStorageElement, CompanyDetail } from './corporation';
import { CorporationService } from './corporation.service';
import { CoreService } from '../core/core.service';
import { Dictionary, map } from '../core/dictionary';
import { ResultMessage } from '../request/response';

@Component({
  selector: 'ap-corp-detail',
  templateUrl : 'app/corps/corporation.detail.component.html'
})
export class CorporationDetailComponent implements OnInit {
  private corpId : number;
  private corpInfo : CorpInfo; // corporation structure received from backend
  private isProdEdit : boolean[]; // edit production flags
  private isEmplEdit : boolean[]; // edit employees list flags
  private isCompOpen : boolean[]; // company info open list flags
  private corpStorage: CorporationStorageElement[];
  private selectedCompanies: boolean[]; // selected companies list flags
  private allSelected: boolean;
  private companyStorageMap: map<CompanyStorageElement[]>;
  private progressValue: number;
  private maxProgress: number;
  private iProgress: number;
  private messages: ResultMessage[];
  private companies: map<CompanyDetail>;
  constructor(
    private _coreService: CoreService,
    private _router : Router,
    private _corporationService: CorporationService,
    private _routeParams: RouteParams
  ) {
    this.companyStorageMap = new map<CompanyStorageElement[]>();
    this.companies = new map<CompanyDetail>();
    this.progressValue = 0;
    this.maxProgress = 0;
    this.iProgress = 0;
  }
  ngOnInit() {
    this.messages = [];
    if(!this._coreService.isLoggedIn) this._router.navigateByUrl('/');
    else {
      this.corpId = +this._routeParams.get('id');
      this.loadCorpInfo();
    }
  }
  loadCompanyDetail(id : number) {
    this._corporationService
      .getCompanyDetail(id)
      .subscribe((res) => {
        this.companies[id] = res;
      })
  }
  loadCorpInfo() {
    this.isProdEdit = [];
    this.isEmplEdit = [];
    this.selectedCompanies = [];
    this.isCompOpen = [];
    this._corporationService
      .getCorpDetail(this.corpId)
      .subscribe((res : CorpInfo) => {
        this.corpInfo = res;
        this._corporationService.getCorpStorage(this.corpId)
          .subscribe((res) => {
            //console.log("storage:",res)
            this.corpStorage = res;
          });
        res.companies.forEach(c => {
          this.companyStorageMap[c.id] = [];
          this._corporationService
            .getCompanyStorage(c.id)
            .subscribe((res) => {
              this.companyStorageMap[c.id] = res;
            });
          this.loadCompanyDetail(c.id);
        });
      });
  }
  addMessage(message : ResultMessage) {
    this.messages.push(message);
  }
  removeMessage(index : number) {
    this.messages.splice(index, 1);
  }
  selectCompany(id : number) {
    this.selectedCompanies[id] = !this.selectedCompanies[id];
  }
  selectAll() {
    this.allSelected = !this.allSelected;
    if(!!this.corpInfo && !!this.corpInfo.companies) this.corpInfo.companies.forEach((item : Company, index : number) => {
      this.selectedCompanies[item.id] = this.allSelected;
    });
  }
  setProdEdit(id : number) {
    this.isProdEdit[id] = !this.isProdEdit[id];
  }
  setEmplEdit(id : number) {
    this.isEmplEdit[id] = !this.isEmplEdit[id];
  }
  openCompany(id : number) {
    this.isCompOpen[id] = !this.isCompOpen[id];
    if(!this.isCompOpen[id]) {
      this.isEmplEdit[id] = false;
      this.isProdEdit[id] = false;
    }
  }
  initProgress(maxNum : number) {
    this.maxProgress = maxNum;
    this.iProgress = 0;
    this.progressValue = 10;
  }
  incrementProgress() {
    console.log("incrementProgress")
    this.iProgress++;
    if (this.iProgress >= this.maxProgress) {
      this.progressValue = 0;
      this.loadCorpInfo();
    } else {
      this.progressValue += 100/this.maxProgress;
    }
    console.log("progress:",this.progressValue);
  }
  putProductionItemsToStorage(company : Company, callback?: any) {
    console.log("company:", company);
    let compId = company.id;
    let amount = company.current_production.quantity;
    if(amount > 0) {
      let itemId = -1;
      this.companyStorageMap[compId].forEach((item : CompanyStorageElement) => {
        if((company.current_production.name == item.ItemType.name) || (company.current_production.img == item.ItemType.image)) itemId = item.ItemType.id;
      });
      if(itemId < 0) {
        this.addMessage({
          msg:"Production item '"+company.current_production.name+"' not found!",
          class:"flash_error"
        });
        console.error("item not found", company.current_production, this.companyStorageMap[compId]);
      } else {
        this._corporationService.moveItemToCorporation(compId, itemId, amount)
          .subscribe((res:ResultMessage[]) => {
            console.log("result:",res);
            res.forEach((m:ResultMessage) => this.addMessage(m));
            if(!!callback) callback();
          });
      }
    } else {
      this.addMessage({
        msg:"Current production is empty",
        class:"flash_error"
      });
      console.log("Current production is empty");
      if(!!callback) callback();
    }
  }
  putAllProductionItemsToStorage() {
    let cNum = this.corpInfo.companies.length;
    this.initProgress(cNum);
    this.corpInfo.companies.forEach((c : Company, index : number) => {
      console.log("processing company ", c.name);
      this.putProductionItemsToStorage(c, () => {this.incrementProgress()});
    });
  }
  addFundsToCompany(company : Company, amount : number, callback?:any) {
    console.log("addFundCompanyAmount", company, amount);
    let compId = company.id;
    if(amount > 0) {
      this._corporationService.addFundsToCompany(compId, amount)
        .subscribe((res:ResultMessage[]) => {
          console.log("result:",res);
          res.forEach((m:ResultMessage) => this.addMessage(m));
          this.loadCompanyDetail(compId);
          if(!!callback) callback();
        })
    }
  }
  addFundsToAll(amount : number) {
    let cNum = this.corpInfo.companies.length;
    this.initProgress(cNum);
    this.corpInfo.companies.forEach((c : Company, index : number) => {
      console.log("processing company ", c.name);
      this.addFundsToCompany(c, amount, () => {this.incrementProgress()});
    });
  }
}

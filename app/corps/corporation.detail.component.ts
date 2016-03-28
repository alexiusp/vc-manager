import { Component, OnInit } from 'angular2/core';
import { RouteParams, Router } from 'angular2/router';

import { CorpInfo, CorporationStorageElement, Company, CompanyStorageElement, CompanyDetail } from './corporation';
import { CorporationService } from './corporation.service';
import { CoreService } from '../core/core.service';
import { Dictionary, map } from '../core/dictionary';
import { ResultMessage } from '../request/response';
import { SupplyListComponent, TransferItem } from './storage/supply.list.component';
import { AlertListComponent } from '../messages/alert.list.component';

@Component({
  selector: 'ap-corp-detail',
  templateUrl : 'app/corps/corporation.detail.component.html',
	directives: [SupplyListComponent, AlertListComponent]
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
	private supplyList: CorporationStorageElement[];
  private progressValue: number;
  private maxProgress: number;
  private iProgress: number;
  private messages: Array<ResultMessage>;
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
		this.messages = [];
		this.supplyList = [];
  }
  ngOnInit() {
    if(!this._coreService.isLoggedIn) this._router.navigateByUrl('/');
    else {
      this.corpId = +this._routeParams.get('id');
      this.loadCorpInfo();
    }
  }
  loadCompanyDetail(id : number) {
    if(this.corpInfo.is_manager) this._corporationService
      .getCompanyDetail(id)
      .subscribe((res) => {
        this.companies[id] = res;
      })
  }
	loadCorpStorage() {
		this._corporationService.getCorpStorage(this.corpId)
			.subscribe((res) => {
				//console.log("storage:",res)
				this.corpStorage = res;
			});
	}
	loadCompanyStorage(cId : number) {
		this._corporationService
			.getCompanyStorage(cId)
			.subscribe((res) => {
				this.companyStorageMap[cId] = res;
			});
	}
	loadCorpDetail(callback?: any) {
		this._corporationService
			.getCorpDetail(this.corpId)
			.subscribe((res : CorpInfo) => {
				this.corpInfo = res;
				if(!!callback) callback();
			});
	}
  loadCorpInfo() {
		this.allSelected = false;
    this.isProdEdit = [];
    this.isEmplEdit = [];
    this.selectedCompanies = [];
    this.isCompOpen = [];
		this.loadCorpDetail(() => {
			this.loadCorpStorage();
			if(this.corpInfo.is_manager) this.corpInfo.companies.forEach(c => {
				this.companyStorageMap[c.id] = [];
				this.loadCompanyStorage(c.id);
				this.loadCompanyDetail(c.id);
			});
		});
  }
  selectCompany(id : number) {
    if(this.corpInfo.is_manager)this.selectedCompanies[id] = !this.selectedCompanies[id];
  }
  selectAll() {
    if(this.corpInfo.is_manager) {
      this.allSelected = !this.allSelected;
      if(!!this.corpInfo && !!this.corpInfo.companies) this.corpInfo.companies.forEach((item : Company, index : number) => {
        this.selectedCompanies[item.id] = this.allSelected;
      });
    }
  }
  setProdEdit(id : number) {
    if(this.corpInfo.is_manager) this.isProdEdit[id] = !this.isProdEdit[id];
  }
  setEmplEdit(id : number) {
    if(this.corpInfo.is_manager) {
      this.isEmplEdit[id] = !this.isEmplEdit[id];
    }
  }
  openCompany(id : number) {
    if(this.corpInfo.is_manager) {
      this.isCompOpen[id] = !this.isCompOpen[id];
      if(!this.isCompOpen[id]) {
        this.isEmplEdit[id] = false;
        this.isProdEdit[id] = false;
      }
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
	putItemToStorageWithRefresh(compId : number, itemId : number, amount : number) {
		this.putItemToStorage(compId, itemId, amount, () => {
			this.loadCorpStorage();
			this.loadCompanyStorage(compId);
		});
	}
	putItemToStorage(compId : number, itemId : number, amount : number, callback?: any) {
		this._corporationService.moveItemToCorporation(compId, itemId, amount)
		.subscribe((res:Array<ResultMessage>) => {
			console.log("result:",res);
			this.messages = res;
			if(!!callback) callback();
		});
	}
  putProductionItemsToStorage(company : Company, callback?: any) {
    if(this.corpInfo.is_manager) {
      console.log("company:", company);
      let compId = company.id;
      let amount = company.current_production.quantity;
      if(amount > 0) {
        let itemId = -1;
        this.companyStorageMap[compId].forEach((item : CompanyStorageElement) => {
          if((company.current_production.name == item.ItemType.name) || (company.current_production.img == item.ItemType.image)) itemId = item.ItemType.id;
        });
        if(itemId < 0) {
					this.messages.push(new ResultMessage("flash_error","Production item '"+company.current_production.name+"' not found!"));
          console.error("item not found", company.current_production, this.companyStorageMap[compId]);
        } else {
          this.putItemToStorage(compId, itemId, amount, callback);
        }
      } else {
				this.messages.push(new ResultMessage("flash_error", "Current production is empty:" + JSON.stringify(company.current_production)));
        console.log("Current production is empty", company.current_production);
        if(!!callback) callback();
      }
    }
  }
  putAllProductionItemsToStorage() {
    if(this.corpInfo.is_manager) {
      let cNum = this.corpInfo.companies.length;
      this.initProgress(cNum);
			for(let c of this.corpInfo.companies) {
				console.log("processing company ", c.name);
        if(this.selectedCompanies[c.id]) this.putProductionItemsToStorage(c, () => {this.incrementProgress()});
        else this.incrementProgress();
			}
    }
  }
  addFundsToCompany(company : Company, amount : number, callback?:any) {
    if(this.corpInfo.is_manager) {
      console.log("addFundCompanyAmount", company, amount);
      let compId = company.id;
      if(amount > 0) {
        this._corporationService.addFundsToCompany(compId, amount)
        .subscribe((res:ResultMessage[]) => {
          console.log("result:",res);
					this.messages = res;
          this.loadCompanyDetail(compId);
          if(!!callback) callback();
        })
      }
    }
  }
  addFundsToAll(amount : number) {
    if(this.corpInfo.is_manager) {
      let cNum = this.corpInfo.companies.length;
      this.initProgress(cNum);
      this.corpInfo.companies.forEach((c : Company, index : number) => {
        console.log("processing company ", c.name);
        if(this.selectedCompanies[c.id]) this.addFundsToCompany(c, amount, () => {this.incrementProgress()});
        else this.incrementProgress();
      });
    }
  }
  investToCorp(amount : number) {
    console.log("investToCorp", amount);
		if(this.corpInfo.is_manager) {
			this._corporationService.addFundsToCorporation(this.corpId, amount)
				.subscribe((res:ResultMessage[]) => {
          console.log("result:",res);
					this.messages = res;
					this.loadCorpDetail();
        });
		}
  }
	itemSelect(item : CorporationStorageElement) {
		//console.log("itemSelect", item);
		let list = [];
		// we need to make a copy of an array to have the = check work
		for(let item of this.supplyList || []) list.push(item);
		let idx = list.indexOf(item);
		if(idx > -1) {
			// remove item from list
			//console.log("remove item");
			list.splice(idx, 1);
		} else {
			// add item to list
			//console.log("add item");
			list.push(item);
		}
		this.supplyList = list;
	}
	putItemsToCompanies(list : TransferItem[]) {
		console.log("putItemsToCompanies", list);
		if(this.corpInfo.is_manager) {
			let cNum = this.corpInfo.companies.length;
			this.initProgress(cNum);
			let counter = 0;
			for(let c of this.corpInfo.companies) {
				if(this.selectedCompanies[c.id]) {
					counter++;
					let compId = c.id;
					this._corporationService.moveItemsToCompany(compId, list)
						.subscribe((res:ResultMessage[]) => {
							console.log("result:",res);
							this.messages = res;
							this.loadCompanyDetail(compId);
							this.incrementProgress();
							this.supplyList = [];
						})
				} else this.incrementProgress();
			}
			if(!counter) {
				this.messages = [new ResultMessage("flash_error","No companies selected!")];
			}
		}
	}
}
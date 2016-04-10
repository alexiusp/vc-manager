import { Component, OnInit } from 'angular2/core';
import { RouteParams, Router, Location } from 'angular2/router';

import { CorpInfo, Company, CompanyDetail, CompanyWorkers } from './contracts';
import { CorporationStorageElement, CompanyStorageElement, BaseStorageElement, CompanyProduction } from './storage/contracts';
import { StorageItem } from './storage/models';
import { CorporationService } from './corporation.service';
import { CoreService } from '../core/core.service';
import { CompanyStorageComponent } from './storage/company.storage.component';

@Component({
  selector: 'ap-company',
  templateUrl : 'app/corps/company.component.html',
	directives: [CompanyStorageComponent]
})
export class CompanyComponent implements OnInit {
	private cId : number;
	private company: CompanyDetail;
	private storage: StorageItem[];
	private workers: CompanyWorkers;
	private production: CompanyProduction[];
	private activePage: number;
	constructor(
    private _coreService: CoreService,
    private _router : Router,
    private _corporationService: CorporationService,
    private _routeParams: RouteParams,
		private _location: Location
  ) {
		this.storage = [];
		this.activePage = 0;
	}
	goBack() {
		this._location.back();
	}
  ngOnInit() {
    if(!this._coreService.isLoggedIn) this._router.navigateByUrl('/');
    else {
      this.cId = +this._routeParams.get('id');
			this.loadInfo();
			this.loadStorage();
			this.loadWorkers();
    }
  }
	loadInfo() {
		this._corporationService.getCompanyDetail(this.cId)
		.subscribe((res : CompanyDetail) => {
			//console.log(res);
			this.company = res;
		});
		this._corporationService.getCompanyProduction(this.cId)
		.subscribe((res) => {
			//console.log("received production", res);
			this.production = res;
		});
	}
	loadStorage() {
		this._corporationService.getCompanyStorage(this.cId)
		.subscribe((res:CompanyStorageElement[]) => {
			let list = [];
			for(let i of res) {
				list.push(new StorageItem(i));
			}
			this.storage = list;
		});
	}
	loadWorkers() {
		this._corporationService.getCompanyWorkers(this.cId)
		.subscribe((res : CompanyWorkers) => {
			this.workers = res;
		});
	}
	setPage(page : number) {
		this.activePage = page;
	}
	addFundsToCompany(amount : number) {
		console.log("addFundsToCompany", amount);
	}
	storageChange(list : any) {
		console.log("storage change:", list);
	}
	private productionOpen	: boolean;
	openProduction() {
		this.productionOpen = !this.productionOpen;
	}
	setProduction(item : CompanyProduction) {
		this._corporationService.setCompanyProduction(this.cId, item.item_type.id)
		.subscribe((res) => {
			console.log("set production result", res);
			this.loadInfo();
		});
	}
}

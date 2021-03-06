import { Component, OnInit, provide }       from 'angular2/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import { BrowserXhr, HTTP_PROVIDERS }    from 'angular2/http';

import { CORSBrowserXHR } from './http.hack';
import { StorageService }     from './storage/storage.service';
import { RequestService }     from './request/request.service';
import { AccountService } from './account/account.service';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './account/profile.component';
import { ObjectService } from './core/object.service';
import { CoreService } from './core/core.service';
import { CorporationService } from './corps/corporation.service';
import { CorporationsComponent } from './corps/corporations.component';
import { CorporationDetailComponent } from './corps/corporation.detail.component';
import { CompanyComponent } from './corps/company.component';
import { AlertListComponent } from './messages/alert.list.component';
import { MessagesService } from './messages/messages.service';
import { MarketComponent } from './market/market.component';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  directives: [ROUTER_DIRECTIVES, AlertListComponent],
  providers: [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(BrowserXhr, {useClass: CORSBrowserXHR}),
    StorageService,
    RequestService,
    CoreService,
    AccountService,
    CorporationService,
    MessagesService
  ]
})
@RouteConfig([
  {
    path: '/',
    name: 'Login',
    component: AccountComponent,
    useAsDefault: true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileComponent
  },
  {
    path: '/corps/:id',
    name: 'CorpDetail',
    component: CorporationDetailComponent
  },
  {
    path: '/corps',
    name: 'Corporations',
    component: CorporationsComponent
  },
  {
    path: '/company/:id',
    name: 'Company',
    component: CompanyComponent
  },
  {
    path: '/market',
    name: 'Market',
    component: MarketComponent
  }
])
export class AppComponent implements OnInit {
  title = 'VC Manager';
  private isLoggedIn : boolean = false;
  constructor(private _coreService: CoreService, private _router : Router) {}
  ngOnInit() {
		let loggedin = this._coreService.isLoggedIn;
		this._coreService.observeLogin((value) => this.onAuthEvent(value));
  }
	onAuthEvent(loggedin : boolean) {
    console.log("isLoggedIn", loggedin);
		this.isLoggedIn = loggedin;
		if(!loggedin) {
			this._router.navigateByUrl('/');
		}
	}
  private showHelp : boolean;
  private helpDisplay;
  openHelp() {
    this.showHelp = true;
    this.helpDisplay = "block";
  }
  closeHelp() {
    this.showHelp = false;
    this.helpDisplay = "none";
  }
}

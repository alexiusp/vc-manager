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

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(BrowserXhr, {useClass: CORSBrowserXHR}),
    StorageService,
    RequestService,
    CoreService,
    AccountService,
    CorporationService
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
  }
])
export class AppComponent implements OnInit {
  title = 'VC Manager';
  private isLoggedIn : boolean = false;
  constructor(private _coreService: CoreService, private _router : Router) {}
  ngOnInit() {
		let loggedin = this._coreService.isLoggedIn;
		this._coreService.observeLogin(_ => {
			console.log("isLoggedIn", this._coreService.isLoggedIn);
			this.onAuthEvent(this._coreService.isLoggedIn);
		});
  }
	onAuthEvent(loggedin : boolean) {
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

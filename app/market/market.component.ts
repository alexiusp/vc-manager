import { Component, OnInit } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
  selector: 'ap-market',
  templateUrl : 'app/market/market.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class MarketComponent implements OnInit {
	ngOnInit() {
		
	}
}

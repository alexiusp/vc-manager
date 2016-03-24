import { Component, OnInit } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';

import { Corporation } from './corporation';
import { CorporationService } from './corporation.service';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'ap-corps',
  templateUrl : 'app/corps/corporations.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class CorporationsComponent implements OnInit {
  private corporations : Corporation[];
  constructor(
    private _corporationService: CorporationService
  ) {}
  ngOnInit() {
    this._corporationService.getCorpsList().subscribe((res : Corporation[]) => {
      //console.log("list finish:", res);
      this.corporations = res;
    });
  }
}

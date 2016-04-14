import { Component, OnInit } from 'angular2/core';
import { MessagesService } from './messages.service';
import { ResultMessage } from '../request/response';

@Component({
  selector: 'alert-list',
	templateUrl: 'app/messages/alert.list.component.html'
})
export class AlertListComponent implements OnInit {
	private successMessages : string[];
  private successIndexes  : number[];
  private successCounter  : number;
  private errorMessages   : ResultMessage[];
  private errorIndexes    : number[];

	constructor(private _messageService : MessagesService) {
	}

  ngOnInit() {
    this._messageService.listen((messages : ResultMessage[]) => {
      //console.log("listen callback");
      let s = [];
      let si = [];
      let e = [];
      let ei = [];
      let counter = 0;
      for(let i in messages) {
        if(messages[i].class == "flash_success" || messages[i].class == "success") {
          let idx = s.indexOf(messages[i].msg);
          if(idx == -1) s.push(messages[i].msg);
          si.push(+i);
          counter++;
        }
        else {
          e.push(messages[i]);
          ei.push(+i);
        }
      }
      this.successMessages = s;
      this.successIndexes = si;
      this.successCounter = counter;
      this.errorMessages = e;
      this.errorIndexes = ei;
    });
  }

	removeErrorMessage(idx : number) {
    //console.log("removeErrorMessage",idx);
		this._messageService.removeMessage(this.errorIndexes[idx]);
	}
  removeSuccesMessages() {
    //console.log("removeSuccesMessages");
    this._messageService.removeMessages(this.successIndexes);
  }
}

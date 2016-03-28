import {Component, Input} from 'angular2/core';

import { ResultMessage } from '../request/response';

@Component({
  selector: 'alert-list',
	templateUrl: 'app/messages/alert.list.component.html'
})
export class AlertListComponent {
	private _messages : ResultMessage[];
	private messageCleanTimeout: any;
	constructor() {
		this._messages = [];
	}
	@Input()
	set messages(msgArr : ResultMessage[]) {
		console.log("messages setter", JSON.stringify(msgArr));
		if(msgArr.length > 0) for(let m of msgArr) {
			this.addMessage(m);
		};
	}
	get messages() { return this._messages; }

	removeMessage(idx : number) {
		this._messages.splice(idx, 1);
	}
	addMessage(message : ResultMessage) {
    this._messages.push(message);
		let timeout = (message.class == 'flash_error')? 5000 : 1000;
    this.messageCleanTimeout = setTimeout(()=>{this.cleanMessage()}, timeout);
  }
	cleanMessage() {
		clearTimeout(this.messageCleanTimeout);
		if(this._messages.length > 0) {
			this.removeMessage(0);
			this.messageCleanTimeout = setTimeout(()=>{this.cleanMessage()}, 2000);
		}
	}
}

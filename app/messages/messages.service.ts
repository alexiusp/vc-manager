import { Injectable } from 'angular2/core';

import { ResponseWrapper, ResultMessage } from '../request/response';

@Injectable()
export class MessagesService {
  private listeners : any[];

  constructor ()	{
    this.listeners = [];
    this._messages = [];
  }

  private _messages  : ResultMessage[];
  get messages() {
    return this._messages;
  }
  set messages(mArr : ResultMessage[]) {
    if(!!mArr) this._messages = mArr;
  }
  listen(callback : any) {
    if(!!callback && typeof callback === "function") this.listeners.push(callback);
  }
  addMessage(c : string | ResultMessage, m? : string) {
    let message;
    if(typeof c === "string") {
      if(!!m) {
        message = new ResultMessage(c, m);
      } else {
        message = new ResultMessage("error", c);
      }
    } else {
      message = <ResultMessage> c;
    }
    if(!!message) {
      this.messages.push(message);
      this.callListeners();
    }
  }
  addMessages(mArr : ResultMessage[]) {
    if(!!mArr) {
      for(let m of mArr) this.messages.push(m);
      this.callListeners();
    }
  }
  removeMessage(i : number) {
    //console.log("remove message:",i);
    let newArr = this.messages;
    newArr.splice(i, 1);
    this.messages = newArr;
    this.callListeners();
  }
  removeMessages(idxArr : number[]) {
    //console.log("remove messages", idxArr, this.messages);
    let newArr = [];
    for(let i in this.messages) if (idxArr.indexOf(+i) == -1) newArr.push(this.messages[+i]);
    this.messages = newArr;
    this.callListeners();
  }
  callListeners() {
    for(let c of this.listeners) c(this.messages);
  }
  clearMessages() {
    this.messages = [];
    this.callListeners();
  }
}

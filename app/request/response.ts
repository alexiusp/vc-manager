export interface ResponseWrapper<T> {
  error   : number;
  message : string;
  data    : T;
}
export class ResultMessage {
  msg : string;
  class: string;
	constructor(c,m) {
		this.msg = m;
		this.class = c;
	}
}

export interface ResponseWrapper<T> {
  error   : number;
  message : string;
  data    : T;
}
export interface ResultMessage {
  msg : string;
  class: string;
}

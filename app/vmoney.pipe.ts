import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'vMoney'})
export class VMoneyPipe implements PipeTransform {
  transform(value:number | string) : string {
    //console.log("VMoneyPipe", value);
    if(value === null) return "";
    let result = +value;
    let answer = "" + value;
    let kr = result % 1000;
    if(kr != result) {
      result = (result - kr) / 1000;
      answer = result + "K";
      let mr = result % 1000;
      if(mr != result) {
        result = (result - mr) / 1000;
        answer = result + "M";
        let br = result % 1000;
        if(br != result) {
          result = (result - br) / 1000;
          answer = result + "B";
        }
      }
    }
    return answer;
  }
}

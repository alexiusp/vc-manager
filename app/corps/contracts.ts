/**
* Data contracts - structure of data received from API
*/
export interface BaseBusiness {
  id  : number;
  name: string;
  img : string;
}
export interface Corporation extends BaseBusiness{
  companies_count: number;
}
export interface Company extends BaseBusiness {
  manager_id:number,
  city:string,
  type:string,
  employees:number,
  employees_limit:number,
  foreign_employees:number,
  foreign_employees_limit:number,
  current_production:ProductionItem
}
export interface ProductionItem {
  name:string,
  img:string,
  quantity:number,
  currently_producing:boolean,
  production_status_title:string
}
export interface ProductionResource {
  title:string,
  needs:string,
  have:number,
  needs_for_start:number
}
export interface ProductionItemDetail extends ProductionItem {
    production_progress:number,
    resources:ProductionResource[]
}
export interface CompanyDetail extends Company {
  user_id:number,
  employees_possible:number,//alias for employees_limit
  foreign_employees_possible:number,//alias for foreign_employees_limit
  vd_balance:string,
  vg_balance:string,
  company_level:number,
  current_production:ProductionItemDetail
  can_start_production:boolean,
  withdraw_tax:string
}
export interface CorpDetail {
  id:number,
  name:string,
  logo:string,
  manager_id_1:number,
  manager_id_2:number,
  manager_id_3:number,
  vd_balance:string,
  vg_balance:string
}
export interface CorpInfo {
  is_manager:boolean,
  corporation:CorpDetail,
  companies:Array<Company>
}

export interface Corporation {
  id  : number;
  name: string;
  img : string;
  companies_count: number;
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
export interface Company {
  id:number,
  manager_id:number,
  name:string,
  city:string,
  type:string,
  img:string,
  employees:number,
  employees_limit:number,
  foreign_employees:number,
  foreign_employees_limit:number,
  current_production:ProductionItem
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

export interface BaseItem {
  item_type_id:number,
  strength:number,
  quantity:number
}

export interface ItemType {
  id:number,
  produce_hours:string,
  class:string,
  stack:number,
  type:string,
  min_damage:string,
  max_damage:string,
  critical:string,
  anticritical:string,
  dodge:string,
  antidodge:string,
  dmg_absorb:string,
  hp_bonus:string,
  level:number,
  add_energy:string,
  restore_energy:string,
  min_range:number,
  max_range:number,
  image:string,
  prestige:number,
  expires:number,
  name:string,
  receipt_type:string,
  heal_health:string,
  strength:string,
  strength_val:number,
  ammunition_id:number | void,
  bonus_damage:string,
  fire_speed:string,
  weapon_type:string,
  need_approve:number,
  receipt_id:number,
  creator_id:number,
  comission:number,
  sold:number,
  quick_slot:number,
  user_creator_id:number,
  special:number,
  quantity_in_stack:number,
  can_use:number,
  description:string,
  category_id:number,
  prod:number,
  energy_bonus:number,
  energy_rest_speed_bonus:number,
  energy_rest_speed_expire:number,
  animation_type:string,
  recalculate_prod_hours:number,
  subtype:string
}

export interface CorporationStorageElement {
  CorporationItem: BaseItem,
  0: {
    total_quantity: number
  },
  ItemType: ItemType
}

export interface CompanyStorageElement {
  CompanyItem: BaseItem,
  0: {
    total_quantity: number
  },
  ItemType: ItemType
}

/**
* Data contracts - structure of data received from API
*/
export interface BaseItem {
  item_type_id:number,
  strength:number,
  quantity:number
}

export interface ItemType {
  id:number,
  produce_hours:string,// production points!
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
  prod:number,// value?
  energy_bonus:number,
  energy_rest_speed_bonus:number,
  energy_rest_speed_expire:number,
  animation_type:string,
  recalculate_prod_hours:number,
  subtype:string
}

export interface BaseStorageElement {
  0: {
    total_quantity: number
  },
  ItemType: ItemType
}

export interface SerializedStorageElement {
	id : number,
	name: string,
	image: string
}

export interface CorporationStorageElement extends BaseStorageElement {
  CorporationItem: BaseItem
}

export interface CompanyStorageElement extends BaseStorageElement {
  CompanyItem: BaseItem
}

export interface ProductionType extends ItemType {
	ItemTypeResource : ResourceItem[]
}
export interface ResourceItem {
	id								: number,
	item_type_main_id	: number,
	item_type_id			: number,
	resource_count		: string,
	production_count	: number,
	ItemTypeMain			: ItemType
}
export interface ResourceRequirement {
	title	: string,
	needs	: string,
	have	: number
}
export interface CompanyProduction {
	item_type : ProductionType,
	resources	: ResourceRequirement[],
	current_production	: boolean,
	production_progress	: string,
	receipt		: boolean
}

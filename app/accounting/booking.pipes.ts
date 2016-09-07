import {Pipe, PipeTransform} from '@angular/core';
import {DzUtil} from "./dz-utils";
import {Account} from "./data/account";

@Pipe({
	name: 'dz_main_cat',
	pure: false
})

export class MainCatFilterPipe implements PipeTransform {

	transform(value: any, type: number): any {
		if (!value || value.length === 0) return value;

		let resultArray = [];
		for (let item of value) {
			if (!item['ParentId'] && (!type || type == item['Typ']))
				resultArray.push(item);
		}

		return resultArray;
	}

	transform_(value: any, args?: any): any {
		if (!value || value.length === 0) return value;

		let resultArray = [];
		for (let item of value) {
			if (!item['ParentId'])
				resultArray.push(item);
		}

		return resultArray;
	}
}


@Pipe({
	name: 'dz_sub_cat',
	pure: false
})

export class SubCatFilterPipe implements PipeTransform {

	transform(value: any, parentId: any): any {
		if (!value || value.length === 0) return value;
		if (!parentId) return [];
		return value.filter(item => item['ParentId'] == parentId);
	}
}

@Pipe({
	name: 'dz_leading_zeros'
})

export class LeadingZerosPipe implements PipeTransform {

	transform(value: any, width: any): any {
		if (!value || value.length === 0) return value;

		return DzUtil.padZeroLeft(width, value);

	}
}


@Pipe({
	name: 'dz_different_account'
})

export class DifferentAccountPipe implements PipeTransform {

	transform(value: Account[], account_id:number): Account[] {
		if (!value || value.length === 0) return value;

		return value.filter((x: Account) => x.Id != account_id);
	}
}


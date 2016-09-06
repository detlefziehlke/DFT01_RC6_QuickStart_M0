import {Pipe, PipeTransform} from '@angular/core';
import {DzUtil} from "./dz-utils";

@Pipe({
	name: 'dzLeadingZeros'
})
export class DzLeadingZerosPipe implements PipeTransform {

	transform(value: string, width: number): any {
		if (!value || value.length === 0) return value;
		return DzUtil.padZeroLeft(width, value);
	}

}

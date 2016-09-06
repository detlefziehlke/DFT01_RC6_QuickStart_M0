import { Pipe, PipeTransform } from '@angular/core';
import {DzUtil} from "./dz-utils";

@Pipe({
  name: 'dzCurrency'
})
export class DzCurrencyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (isNaN(value)) return value;

		return DzUtil.format_currency(value);

  }

}

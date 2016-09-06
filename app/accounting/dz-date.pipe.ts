import { Pipe, PipeTransform } from '@angular/core';
import {DzUtil} from "./dz-utils";

@Pipe({
  name: 'dzDate'
})
export class DzDatePipe implements PipeTransform {

  transform(value: string): string {
    return DzUtil.format_date_json_to_display(value);
  }

}

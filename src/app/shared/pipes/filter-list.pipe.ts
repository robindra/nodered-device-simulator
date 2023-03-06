import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterList'
})
export class FilterListPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value.filter((info: any)=> info.id == args[0]);
  }

}

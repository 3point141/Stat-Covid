import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'category'
})
@Injectable()
export class CategoryPipe implements PipeTransform {

  transform(array:any[],query:string ){

    var queries = [];
    if (!query || query === '') {
      return array;
    }else {
      queries = query.split(',');
    }

    let filtered = [];

    for(let i = 0; i < queries.length; i++) {
      array.forEach(function (element) {
        let isAdded = false;
        Object.keys(element).forEach(function (key, index) {
          if (!isAdded && element[key] && element[key].toString().toLowerCase().includes(queries[i].toLowerCase())) {
            filtered.push(element);
            isAdded = true;
          }
        });
      });
    }

    return filtered;
  }
}

import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'isplSearch'
})
export class GridSearchPipe implements PipeTransform {

    private _filterOption = {};
    transform(value, filter, filterOption) {
        (filterOption) ? this._filterOption = filterOption : null;
        filter = filter ? filter : '';
        value = value ? value : [];
        return value.filter((item) => (
          this.filterData(item).indexOf(
            filter.toUpperCase())) >= 0 );
    }

  filterData(item): string {
      // console.log(item);
      let baseData: string = '';

      for (let fliterOption in this._filterOption) {
        // console.log("fliterOption: ",fliterOption);
        if (fliterOption && item[fliterOption]) {
          let searchData = '';
          // console.log("typeof item[fliterOption]",typeof item[fliterOption]);
          // console.log("item[fliterOption]",item[fliterOption]);
          // console.log("isNaN(item[fliterOption])::",isNaN(item[fliterOption]));

          // if (typeof item[fliterOption] === 'string' && isNaN(item[fliterOption])) {
          //    searchData = item[fliterOption] ? item[fliterOption].toUpperCase() : '';
          // } else if (typeof item[fliterOption] === 'number') {
          //   // searchData = item[fliterOption] ? item[fliterOption] : '';
          // }

        if (typeof item[fliterOption] === 'string') {
          if(isNaN(item[fliterOption])){
            searchData = item[fliterOption] ? item[fliterOption].toUpperCase() : '';
          }else{
            let itemstr: string = item[fliterOption];
            searchData = itemstr ? itemstr.toUpperCase() : '';
          }
            
         } else if (typeof item[fliterOption] === 'number') {
           // searchData = item[fliterOption] ? item[fliterOption] : '';
         }


          baseData = baseData + ' ' + searchData;
        }
      }
      // console.log(baseData);
      return baseData;
    }
}

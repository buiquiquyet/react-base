import Fuse from "fuse.js";
import { debounce } from "lodash";
import { BuildParams } from "./BuildParams";

export class BuildSearch {
  public static Search(
    keys: any[],
    datas: any[],
    valueSearch: string,
    threshold: number | 0.5
  ) {
    const options = {
      keys: keys,
      threshold,
      useExtendedSearch: true,
      includeScore: true,
      includeMatches: true,
    };
    const fuse = new Fuse(datas, options);
    const newDatas = fuse.search(valueSearch);
    return newDatas.map((data) => data.item);
  }
  public static handleDebouncedSearch = debounce(
    (value: string, fieldName: any[], threshold: number, dataCoppy: any[]) => {
      if (value) {
        if (dataCoppy?.length > 0) {
          const newDataUser = this.Search(
            fieldName,
            dataCoppy,
            value,
            threshold
          );
          if (newDataUser.length > 0) {
            const coppyData = [...dataCoppy];
            const newArr = BuildParams.commonItemsOf2Arr(
              coppyData,
              newDataUser
            );
            return newArr;
          } else return [];
        }
      } else {
        return false;
      }
    },
    1000
  );
  public static handleChangeSearch = (
    value: any,
    fieldName: any[],
    threshold: number,
    dataCoppy: any[]
  ) => {
    this.handleDebouncedSearch(value, fieldName, threshold, dataCoppy);
  };
}

import Fuse from "fuse.js";

export class BuildSearch {
  public static Search(keys: any[], datas: any[], valueSearch: string, threshold: number | 0.5 ) {
    const options = {
      keys: keys,
      threshold , 
      useExtendedSearch: true, 
      includeScore: true, 
      includeMatches: true,
    };
    const fuse = new Fuse(datas, options);
    const newDatas = fuse.search(valueSearch);
    return newDatas.map((data) => data.item);
  }
}

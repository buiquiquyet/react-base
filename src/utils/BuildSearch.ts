import Fuse from "fuse.js";

export class BuildSearch {
  public static search(keys: any[], datas: [], valueSearch: string) {
    const options = {
      keys: keys,
    };
    const fuse = new Fuse(datas, options);
    const newDatas = fuse.search(valueSearch);
    return newDatas.map(data => data.item)
  }
}

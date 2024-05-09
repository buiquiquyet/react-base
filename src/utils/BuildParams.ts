import { Page } from "./Page";
import queryString from "query-string";
export class BuildParams {
    public static Params(page?: Page ): string {
        const params: { [key: string]: any } = {
            page: page?.pageNumber.toString(),
            size: page?.pageSize.toString(),
        };
        return '?' + queryString.stringify(params);
    }
    public static getLocalStorage(key: string) {
        return localStorage.getItem(key)
    }

    public static setLocalStorage(key: string, data: any,) {
        localStorage.setItem(key, data);
    }
    public static removeLocalStorage(key: string) {
        localStorage.removeItem(key);
    }
    public static isLocation(pathName: string) {
        return location.pathname.includes(pathName)
    }
    public static starWith(pathName: string) {
        return location.pathname.startsWith(pathName)
    }
    public static compare(pathName: string) {
        return location.pathname === (pathName)
    }
}
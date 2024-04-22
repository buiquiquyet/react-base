import { Page } from "./Page";
import queryString from "query-string";
export class BuildParams {
    public static Params(page: Page, search?: any ): string {
        const params: { [key: string]: any } = {
            page: page.pageNumber,
            size: page.pageSize,
            search
        };
        return queryString.stringify(params);
    }
    public static getLocalStorage(key: string) {
        return localStorage.getItem(key)
    }

    public static setLocalStorage(key: string, data: any,) {
        localStorage.setItem(key, data);
    }
}
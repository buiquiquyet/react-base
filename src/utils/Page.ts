

export class Page {
    perPageOptions: any[] = [10, 20, 30, 50];
    totalItems: number = 0;
    totalPages: number = 1;
    currentPage: number = 1; 
    pageSize: number = this.perPageOptions[0];
    pageNumber: number = 1;
}
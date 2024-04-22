

export class Page {
    perPageOptions: number[] = [25, 30, 50, 100];
    totalItems: number = 0;
    totalPages: number = 1;
    currentPage: number = 1; 
    pageSize: number = this.perPageOptions[0];
    pageNumber: number = 0;
}
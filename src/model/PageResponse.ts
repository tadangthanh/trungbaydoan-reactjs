export class PageResponse {
    status: number;
    data: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        hasNext: boolean;
        pageSize: number;
        items: any[];
    }
    constructor(status: number, data: any) {
        this.status = status;
        this.data = data;
    }


}
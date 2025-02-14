export class QueryParamsPatentings {
    dateFrom?: string | null;
    dateTo?: string;
    lastDischarge?: boolean;
    errorType?: string | null;
    fileId?: string | null;
    pageNumber: number = 1;
    pageSize: number = 10;
}

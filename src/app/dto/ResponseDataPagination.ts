export interface ResponseDataPagination<T> {
  errCode: string;
  errMessage: string;
  data: {
    content: T[],
    totalElements: number,
    totalPages: number
  };
}

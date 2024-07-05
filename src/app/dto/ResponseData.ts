export interface ResponseData<T> {
  errCode: string;
  errMessage: string;
  data: T;
}

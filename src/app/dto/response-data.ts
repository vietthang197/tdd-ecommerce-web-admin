export interface ResponseData<T> {
  errCode: string;
  errMessage: string | null;
  data: T | null;
}

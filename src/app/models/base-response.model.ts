export class BaseResponse<T> {
  statusCode: number | null;
  message: string | null;
  stackTrace: string | null;
  result: T | null;
  results: T[];

  constructor() {
    this.statusCode = null;
    this.message = null;
    this.stackTrace = null;
    this.result = null;
    this.results = [];
  }
}

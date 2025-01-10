export class InterceptedError {
  status: number | null;
  statusText: string | null;
  message: string | null;

  constructor() {
    this.status = null;
    this.statusText = null;
    this.message = null;
  }
}

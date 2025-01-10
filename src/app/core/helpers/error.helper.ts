export class ErrorHelper {
  public static getErrorMessage(err: any): string {
    let errorMessage = 'Desconocido';
    if (err.error.message) {
      errorMessage = err.error.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    return errorMessage;
  }
}

export class FileCreateDto {
  id: string | null;
  cutDate?: string;
  name: string;
  status: string;
  recordQuantity: string;
  url: string;
  date: string;
  day: string;
  month: string;
  year: string;
  fileTypeID: string;
  fileUpload?: FormData;

  constructor() {
    this.id = '';
    this.name = '';
    this.status = '';
    this.recordQuantity = '';
    this.url = '';
    this.date = '';
    this.day = '';
    this.month = '';
    this.year = '';
    this.fileTypeID = '';
  }
}

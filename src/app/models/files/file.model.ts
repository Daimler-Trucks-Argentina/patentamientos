import { Base } from '../base.model';
import { Daily } from '../dailies/daily.model';
import { Monthly } from '../monthlies/monthly.model';
import { Wholesale } from '../wholesales/wholesale.model';

export class File extends Base {
  autoId: number | null;
  name: string;
  status: string;
  recordQuantity: string;
  url: string;
  date: string;
  day: string;
  month: string;
  year: string;
  fileTypeID: string;
  wholesales?: Wholesale[] | null;
  dailies?: Daily[] | null;
  monthlies?: Monthly[] | null;

  constructor() {
    super();
    this.autoId = 0;
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

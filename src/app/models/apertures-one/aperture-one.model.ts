import { Base } from '../base.model';

export class ApertureOne extends Base {
  mercedesApertureOne: string;
  descriptionShort: string;
  descriptionLong: string;
  codName?: string;
  segCategory?: string;

  constructor() {
    super();
    this.mercedesApertureOne = '';
    this.descriptionShort = '';
    this.descriptionLong = '';
    this.segCategory = '';
  }
}

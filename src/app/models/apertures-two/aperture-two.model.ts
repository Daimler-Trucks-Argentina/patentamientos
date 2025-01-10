import { Base } from '../base.model';

export class ApertureTwo extends Base {
  mercedesApertureTwo: string;
  descriptionShort: string;
  descriptionLong: string;
  codName?: string;
  segCategory?: string;

  constructor() {
    super();
    this.mercedesApertureTwo = '';
    this.descriptionShort = '';
    this.descriptionLong = '';
    this.segCategory = '';
  }
}

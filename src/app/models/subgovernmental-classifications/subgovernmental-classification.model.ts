import { Base } from '../base.model';

export class SubgovernmentalClassification extends Base {
  mercedesSubgovernmentalClassification: string;
  descriptionShort: string;
  descriptionLong: string;

  constructor() {
    super();
    this.mercedesSubgovernmentalClassification = '';
    this.descriptionShort = '';
    this.descriptionLong = '';
  }
}

import { Base } from '../base.model';

export class GovernmentalClassification extends Base {
  mercedesGovernmentalClassification: string;
  descriptionShort: string;
  descriptionLong: string;

  constructor() {
    super();
    this.mercedesGovernmentalClassification = '';
    this.descriptionShort = '';
    this.descriptionLong = '';
  }
}

import { Base } from '../base.model';

export class CuitClassification extends Base {
  mercedesCuitClassification: string;
  descriptionShort: string;
  descriptionLong: string;

  constructor() {
    super();
    this.mercedesCuitClassification = '';
    this.descriptionShort = '';
    this.descriptionLong = '';
  }
}

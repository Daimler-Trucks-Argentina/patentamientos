import { Base } from '../base.model';

export class LegalEntity extends Base {
  mercedesLegalEntity: string;
  descriptionShort: string;
  descriptionLong: string;

  constructor() {
    super();
    this.mercedesLegalEntity = '';
    this.descriptionShort = '';
    this.descriptionLong = '';
  }
}

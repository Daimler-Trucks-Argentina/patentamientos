import { Base } from '../base.model';

export class LogisticClassification extends Base {
  mercedesLogisticClassification: string;
  descriptionShort: string;
  descriptionLong: string;

  constructor() {
    super();
    this.mercedesLogisticClassification = '';
    this.descriptionShort = '';
    this.descriptionLong = '';
  }
}

import { Base } from '../base.model';

export class EstimatedTurnover extends Base {
  mercedesEstimatedTurnover: string;
  descriptionShort: string;
  descriptionLong: string;

  constructor() {
    super();
    this.mercedesEstimatedTurnover = '';
    this.descriptionShort = '';
    this.descriptionLong = '';
  }
}

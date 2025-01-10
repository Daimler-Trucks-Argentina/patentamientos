import { Base } from '../base.model';

export class PbtTN extends Base {
  autoId: number | null;
  mercedesPBTTN: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesPBTTN = '';
  }
}

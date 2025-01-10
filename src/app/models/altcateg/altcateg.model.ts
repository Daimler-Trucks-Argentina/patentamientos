import { Base } from '../base.model';

export class AltCateg extends Base {
  autoId: number | null;
  mercedesAltCateg: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesAltCateg = '';
  }
}

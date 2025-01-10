import { Base } from '../base.model';

export class AltBodySt extends Base {
  autoId: number | null;
  mercedesAltBodyst: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesAltBodyst = '';
  }
}

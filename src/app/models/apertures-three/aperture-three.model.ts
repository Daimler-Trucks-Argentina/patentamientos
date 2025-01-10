import { Base } from '../base.model';

export class Apertura3 extends Base {
  autoId: number | null;
  mercedesApertureThree: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesApertureThree = '';
  }
}

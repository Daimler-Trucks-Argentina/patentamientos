import { Base } from '../base.model';

export class Apertura4 extends Base {
  autoId: number | null;
  mercedesApertureFour: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesApertureFour = '';
  }
}

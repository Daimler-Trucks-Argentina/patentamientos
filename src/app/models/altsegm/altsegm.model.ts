import { Base } from '../base.model';

export class AltSegm extends Base {
  autoId: number | null;
  mercedesAltSegm: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesAltSegm = '';
  }
}

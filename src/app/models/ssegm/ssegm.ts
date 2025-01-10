import { Base } from '../base.model';

export class Ssegm extends Base {
  autoId: number | null;
  mercedesSSegm: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesSSegm = '';
  }
}

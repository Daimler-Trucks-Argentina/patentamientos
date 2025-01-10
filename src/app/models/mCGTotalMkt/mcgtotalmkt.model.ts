import { Base } from '../base.model';

export class MCGTotalMkt extends Base {
  autoId: number | null;
  mercedesMCGTotalMkt: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesMCGTotalMkt = '';
  }
}

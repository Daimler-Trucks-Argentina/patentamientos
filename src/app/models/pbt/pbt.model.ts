import { Base } from '../base.model';

export class PBT extends Base {
  autoId: number | null;
  mercedesPBT: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesPBT = '';
  }
}

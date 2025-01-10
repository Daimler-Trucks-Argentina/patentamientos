import { Base } from '../base.model';

export class Power extends Base {
  autoId: number | null;
  mercedesPower: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesPower = '';
  }
}

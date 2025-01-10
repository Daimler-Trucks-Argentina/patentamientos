import { Base } from '../base.model';

export class AmgCompSet extends Base {
  autoId: number | null;
  mercedesAMGCompSet: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesAMGCompSet = '';
  }
}

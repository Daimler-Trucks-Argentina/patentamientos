import { Base } from '../base.model';

export class AxleBase extends Base {
  autoId: number | null;
  mercedesAxleBase: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesAxleBase = '';
  }
}

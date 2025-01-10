import { Base } from '../base.model';

export class Usage extends Base {
  autoId: number | null;
  mercedesUsage: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesUsage = '';
  }
}

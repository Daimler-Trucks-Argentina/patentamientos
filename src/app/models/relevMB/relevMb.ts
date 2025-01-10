import { Base } from '../base.model';

export class RelevMB extends Base {
  autoId: number | null;
  mercedesRelevMB: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesRelevMB = '';
  }
}

import { Base } from '../base.model';

export class Source extends Base {
  autoId: number | null;
  mercedesSource: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesSource = '';
  }
}

import { Base } from '../base.model';

export class BodyStyle extends Base {
  autoId: number | null;
  mercedesBodyStyle: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesBodyStyle = '';
  }
}

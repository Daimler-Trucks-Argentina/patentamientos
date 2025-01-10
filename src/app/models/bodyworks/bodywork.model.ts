import { Base } from '../base.model';

export class Bodywork extends Base {
  autoId: number | null;
  mercedesBodywork: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesBodywork = '';
  }
}

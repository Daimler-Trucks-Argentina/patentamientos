import { Base } from '../base.model';

export class Ni extends Base {
  autoId: number | null;
  mercedesNI: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesNI = '';
  }
}

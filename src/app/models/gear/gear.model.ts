import { Base } from '../base.model';

export class Gear extends Base {
  autoId: number | null;
  mercedesGear: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesGear = '';
  }
}

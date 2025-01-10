import { Base } from '../base.model';

export class Wheelbases extends Base {
  autoId: number | null;
  mercedesWheelBase: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesWheelBase = '';
  }
}

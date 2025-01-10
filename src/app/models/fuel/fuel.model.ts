import { Base } from '../base.model';

export class FuelTypes extends Base {
  autoId: number | null;
  mercedesFuelType: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesFuelType = '';
  }
}

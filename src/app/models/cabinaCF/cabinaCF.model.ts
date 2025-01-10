import { Base } from '../base.model';

export class CabinaCF extends Base {
  autoId: number | null;
  mercedesCabinCF: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesCabinCF = '';
  }
}

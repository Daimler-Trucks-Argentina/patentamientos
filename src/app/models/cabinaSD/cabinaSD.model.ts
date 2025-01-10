import { Base } from '../base.model';

export class CabinaSD extends Base {
  autoId: number | null;
  mercedesCabinSD: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesCabinSD = '';
  }
}

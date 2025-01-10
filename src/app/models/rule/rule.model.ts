import { Base } from '../base.model';

export class Rule extends Base {
  autoId: number | null;
  mercedesCatRule: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesCatRule = '';
  }
}

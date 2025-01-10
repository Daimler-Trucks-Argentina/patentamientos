import { Base } from '../base.model';

export class mercedesConfiguration extends Base {
  autoId: number | null;
  mercedesConfiguration: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesConfiguration = '';
  }
}

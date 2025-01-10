import { Base } from '../base.model';

export class Door extends Base {
  autoId: number | null;
  mercedesDoor: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesDoor = '';
  }
}

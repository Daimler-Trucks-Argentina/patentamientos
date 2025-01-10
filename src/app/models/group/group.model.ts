import { Base } from '../base.model';

export class Group extends Base {
  autoId: number | null;
  mercedesGroup: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesGroup = '';
  }
}

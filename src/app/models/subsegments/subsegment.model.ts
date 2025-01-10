import { Base } from '../base.model';

export class Subsegment extends Base {
  autoId: number | null;
  mercedesSubsegment: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesSubsegment = '';
  }
}

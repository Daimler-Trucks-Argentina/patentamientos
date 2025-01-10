import { Base } from '../base.model';

export class CompetitiveCjd extends Base {
  autoId: number | null;
  mercedesCompetitiveCJD: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesCompetitiveCJD = '';
  }
}

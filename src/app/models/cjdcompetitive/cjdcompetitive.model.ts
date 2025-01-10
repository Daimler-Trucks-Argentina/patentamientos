import { Base } from '../base.model';

export class CjdCompetitive extends Base {
  autoId: number | null;
  mercedesCJDCompetitive: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesCJDCompetitive = '';
  }
}

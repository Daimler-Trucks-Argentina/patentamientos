import { Base } from '../base.model';

export class Apertura2 extends Base {
  autoId: number | null;
  mercedesapertura2: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesapertura2 = '';
  }
}

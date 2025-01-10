import { Base } from '../base.model';

export class Apertura1 extends Base {
  autoId: number | null;
  mercedesapertura1: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesapertura1 = '';
  }
}

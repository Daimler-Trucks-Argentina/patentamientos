import { Base } from '../base.model';

export class Traction extends Base {
  autoId: number | null;
  mercedesTraction: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesTraction = '';
  }
}

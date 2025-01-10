import { Base } from '../base.model';

export class Rule extends Base {
  autoId: number | null;
  name: string;
  description?: string;
  code: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.name = '';
    this.code = '';
  }
}

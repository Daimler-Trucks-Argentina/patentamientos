import { Base } from '../base.model';

export class Category extends Base {
  autoId: number | null;
  segCategory?: string;
  description?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
  }
}

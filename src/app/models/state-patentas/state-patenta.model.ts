import { Base } from '../base.model';

export class StatePatenta extends Base {
  autoId: number | null;
  name: string;
  description?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.name = '';
  }
}

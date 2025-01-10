import { Base } from '../base.model';

export class Permission extends Base {
  autoId: number | null;
  name: string;
  description: string;
  ordering?: number | null;
  granted?: boolean

  constructor() {
    super();
    this.autoId = 0;
    this.name = '';
    this.description = '';
  }
}

import { Base } from '../base.model';

export class VehicleType extends Base {
  autoId?: number | null;
  name: string;
  description?: string;

  constructor() {
    super();
    this.name = '';
  }
}

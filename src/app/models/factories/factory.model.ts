import { Base } from '../base.model';

export class Factory extends Base {
  autoId?: number | null;
  name: string;
  description?: string;
  mercedesFabricaId?: string;
  codName?: string;

  constructor() {
    super();
    this.name = '';
  }
}

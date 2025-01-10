import { Base } from '../base.model';

export class Province extends Base {
  autoId?: number | null;
  name: string;
  description?: string;
  mercedesProvinciaId?: string;

  constructor() {
    super();
    this.name = '';
  }
}

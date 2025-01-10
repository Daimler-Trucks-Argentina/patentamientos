import { Base } from '../base.model';

export class Department extends Base {
  autoId: number | null;
  name: string;
  description?: string;
  mercedesProvinciaId?: string;
  mercedesDepartamentoId?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.name = '';
  }
}

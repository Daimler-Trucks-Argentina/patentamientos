import { Base } from '../base.model';

export class Location extends Base {
  autoId: number | null;
  name: string;
  description?: string;
  mercedesLocalidadId?: string;
  mercedesProvinciaId?: string;
  mercedesDepartamentoId?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.name = '';
  }
}

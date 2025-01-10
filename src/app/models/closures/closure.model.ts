import { Base } from '../base.model';

export class Closure extends Base {
  autoId: number | null;
  fechaCorte?: Date | string;
  fechaCreacion?: Date;
  horaCreacion: string;
  esUltimo: boolean;

  constructor() {
    super();
    this.autoId = 0;
    this.horaCreacion = '';
    this.esUltimo = false;
  }
}

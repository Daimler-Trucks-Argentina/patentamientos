import { Base } from '../base.model';
import { CarModel } from '../car-models/car-model.model';
import { Terminal } from '../terminals/terminal.model';

export class Tmmv extends Base {
  autoId: number | null;
  versionPatentamiento?: string;
  versionWs?: string;
  versionInterna?: string;
  descripcionTerminal?: string;
  descripcionMarca?: string;
  descripcionModelo?: string;
  descripcionVerPat?: string;
  descripcionVerWs?: string;
  descripcionVerInt?: string;
  carModelId?: string;
  carModel?: CarModel | null;

  constructor() {
    super();
    this.autoId = 0;
  }
}

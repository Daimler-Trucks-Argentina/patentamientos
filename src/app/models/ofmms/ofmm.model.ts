import { Base } from '../base.model';
import { CarModel } from '../car-models/car-model.model';
import { Factory } from '../factories/factory.model';

export class Ofmm extends Base {
  autoId: number | null;
  zofmm?: string;
  validoHasta?: Date;
  validoDesde?: Date;
  fabricaPat?: string;
  marcaPat?: string;
  modelopat?: string;
  descripcion1?: string;
  descripcion2?: string;
  tipoDeTexto?: string;
  terminal?: string;
  marca?: string;
  modelo?: string;
  versionPatentamiento?: string;
  origen?: string;
  carModelId?: string;
  carModel?: CarModel | null;
  factoryId?: string;
  factory?: Factory | null;
  isPatenting?: boolean;

  constructor() {
    super();
    this.autoId = 0;
  }
}

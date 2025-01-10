import { Base } from '../base.model';
import { CarModel } from '../car-models/car-model.model';

export class InternalVersion extends Base {
  autoId: number | null;
  mercedesMarcaId?: string;
  carModelId: string;
  carModel?: CarModel | null;
  mercedesModeloId?: string;
  mercedesTerminalId?: string;
  versionPatentamiento?: string;
  versionWs?: string;
  versionInterna?: string;
  descripcionVerInt?: string;
  uploadDate?: Date;
  dateTo?: Date;
  dateFrom?: Date;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.carModelId = '';
  }
}

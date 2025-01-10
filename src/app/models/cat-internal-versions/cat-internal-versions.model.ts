import { Base } from '../base.model';
import { CarModel } from '../car-models/car-model.model';
export class CatInternalVersion extends Base {
  autoId: number | null;
  mercedesMarcaId?: string;
  carModelId: string;
  carModel?: CarModel | null;
  mercedesModeloId?: string;
  mercedesTerminalId?: string;
  version?: string;
  description?: string;
  codName?: string;
  dateFrom?: Date;
  dateTo?: Date;

  constructor() {
    super();
    this.autoId = 0;
    this.carModelId = '';
  }
}

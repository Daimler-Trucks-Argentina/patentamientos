import { Base } from '../base.model';
import { CarModel } from '../car-models/car-model.model';

export class Grado extends Base {
  autoId: number;
  marcaWs: string;
  modeloWs: string;
  grade: string;
  dateTo: Date;
  dateFrom: Date;
  mercedesTerminalId: string;
  mercedesMarcaId: string;
  mercedesModeloId: string;
  carModelId: string;
  carModel?: CarModel | null;
  versionWs: string;
  dischargeDate: Date;

  constructor() {
    super();
    this.autoId = 0;
    this.marcaWs = '';
    this.modeloWs = '';
    this.grade = '';
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.mercedesTerminalId = '';
    this.mercedesMarcaId = '';
    this.mercedesModeloId = '';
    this.carModelId = '';
    this.versionWs = '';
    this.dischargeDate = new Date();
  }
}

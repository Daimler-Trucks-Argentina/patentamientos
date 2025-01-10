import { Base } from '../base.model';

export class MotorDT extends Base {
  autoId: number | null;
  mercedesMotorDT: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesMotorDT = '';
  }
}

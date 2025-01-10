import { Base } from '../base.model';

export class RegSec extends Base {
  autoId: number | null;
  name: string;
  description?: string;
  registryNumber?: string;
  registryProvince?: string;
  registryDepartment?: string;
  registryLocation?: string;
  autoZoneDealer?: string;
  autoZoneDescription?: string;
  truckZoneDealer?: string;
  truckZoneDescription?: string;
  vanZoneDealer?: string;
  vanZoneDescription?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.name = '';
  }
}

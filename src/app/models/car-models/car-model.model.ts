import { Base } from '../base.model';
import { Brand } from '../brands/brand.model';

export class CarModel extends Base {
  autoId?: number | null;
  name: string;
  description?: string;
  brandId: string;
  brand?: Brand | null;
  mercedesTerminalId?: string;
  mercedesMarcaId?: string;
  mercedesModeloId?: string;
  codName?: string;

  constructor() {
    super();
    this.name = '';
    this.brandId = '';
  }
}

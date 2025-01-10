import { Base } from '../base.model';
import { Category } from '../categories/category.model';

export class Segment extends Base {
  autoId: number | null;
  categoryId: string;
  category?: Category | null;
  mercedesCategoriaId?: string;
  segName?: string;
  descriptionShort?: string;
  descriptionLong?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.categoryId = '';
  }
}

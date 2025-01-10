import { Base } from '../base.model';
import { InternalVersionSegmentation } from '../internal-version-segmentations/internal-version-segmentation.model';

export class KeyVersion extends Base {
  autoId: number | null;
  mercedesTerminalId?: string;
  mercedesMarcaId?: string;
  mercedesModeloId?: string;
  internalVersionSegmentationId: string;
  internalVersionSegmentation?: InternalVersionSegmentation | null;
  mercedesVersionInternaSegmentacionId?: string;
  mercedesVersionClaveId?: string;
  dateTo?: Date;
  dateFrom?: Date;
  descriptionShort?: string;
  descriptionLong?: string;
  segCategory?: string;
  segName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.internalVersionSegmentationId = '';
  }
}

import { Base } from '../base.model';
import { File } from '../files/file.model';
import { KeyVersion } from '../key-versions/key-version.model';
import { Ofmm } from '../ofmms/ofmm.model';
import { Patenting } from '../patentings/patenting.model';

export class SegmentationPlate extends Base {
  autoId: number | null;
  patentingId?: string;
  patenting?: Patenting | null;
  ofmmId?: string;
  ofmm?: Ofmm | null;
  keyVersionId?: string;
  keyVersion?: KeyVersion | null;
  mercedesSegmentacionDominioId?: string;
  mercedesSegmentacionDominioNumero?: number;
  fileId?: string;
  file?: File | null;

  constructor() {
    super();
    this.autoId = 0;
  }
}

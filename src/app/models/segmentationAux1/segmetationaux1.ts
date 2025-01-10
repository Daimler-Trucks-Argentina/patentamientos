import { Base } from '../base.model';

export class SegmentationAux1 extends Base {
  autoId: number | null;
  mercedesSegmentationAux1: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesSegmentationAux1 = '';
  }
}

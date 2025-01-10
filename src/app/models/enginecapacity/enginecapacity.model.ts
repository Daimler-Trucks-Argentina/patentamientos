import { Base } from '../base.model';

export class EngineCapacity extends Base {
  autoId: number | null;
  mercedesEngineCapacity: string;
  description?: string;
  segCategory?: string;
  codName?: string;

  constructor() {
    super();
    this.autoId = 0;
    this.mercedesEngineCapacity = '';
  }
}

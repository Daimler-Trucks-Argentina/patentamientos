import { Base } from '../base.model';

export class Terminal extends Base {
  autoId?: number | null;
  name: string;
  description?: string;
  mercedesTerminalId?: string;
  codName?: string;

  constructor() {
    super();
    this.name = '';
  }
}

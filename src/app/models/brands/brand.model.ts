import { Base } from '../base.model';
import { Terminal } from '../terminals/terminal.model';

export class Brand extends Base {
  autoId?: number | null;
  name: string;
  description?: string;
  mercedesTerminalId?: string;
  mercedesMarcaId?: string;
  terminalId: string;
  terminal?: Terminal | null;
  codName?: string;

  constructor() {
    super();
    this.name = '';
    this.terminalId = '';
  }
}

import { Base } from '../base.model';

export class Owner extends Base {
  autoId?: number | null;
  fullName: string;
  cuit: string;
  cuitPref: string;

  constructor() {
    super();
    this.fullName = '';
    this.cuit = '';
    this.cuitPref = '';
  }
}

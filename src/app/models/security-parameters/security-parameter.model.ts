import { Base } from '../base.model';

export class SecurityParameter extends Base {
  autoId: number | null;
  sessionTime: number;
  numberLogins: number;
  minCharacters: number;
  maxCharacters:number
  includeCapitalLetter : boolean
  includeNumbers : boolean
  includeSpecialCharacters:boolean

  constructor() {
    super();
    this.autoId = 0;
    this.sessionTime = 0;
    this.numberLogins = 0;
    this.minCharacters = 0;
    this.maxCharacters = 0;
    this.includeCapitalLetter = false;
    this.includeNumbers = false;
    this.includeSpecialCharacters = false;
  }
}

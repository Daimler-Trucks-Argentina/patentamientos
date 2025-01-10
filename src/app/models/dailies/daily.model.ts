import { Base } from '../base.model';

export class Daily extends Base {
  AutoId: number;
  FileId: string;
  Source: string;
  Plate: string;
  Motor: string;
  Chassis: string;
  FMM_MTM: string;
  Factory_D: string;
  Brand_D: string;
  Model_D: string;
  Type_D: string;
  Reg_Date: Date;
  RegSec: string;
  Desc_Reg: string;
  Desc_Prov: string;
  Taxi: string;
  CUIT: string;

  constructor() {
    super();
    this.AutoId = 0;
    this.FileId = '';
    this.Source = '';
    this.Plate = '';
    this.Motor = '';
    this.Chassis = '';
    this.FMM_MTM = '';
    this.Factory_D = '';
    this.Brand_D = '';
    this.Model_D = '';
    this.Type_D = '';
    this.Reg_Date = new Date();
    this.RegSec = '';
    this.Desc_Reg = '';
    this.Desc_Prov = '';
    this.Taxi = '';
    this.CUIT = '';
  }
}

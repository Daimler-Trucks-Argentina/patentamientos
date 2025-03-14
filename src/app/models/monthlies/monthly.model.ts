import { Base } from '../base.model';

export class Monthly extends Base {
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
  Mode: string;
  Owner: string;
  CUIT_PREF: string;
  Address: string;
  COD_PRO: string;
  DESC_PROV: string;
  COD_DPT: string;
  DESC_DPT: string;
  COD_LOC: string;
  DESC_LOC: string;
  City: string;
  Zip: string;
  Year_Model: string;
  CodCar: string;
  CountryFA: string;
  CountryPR: string;
  Weight: string;
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
    this.Mode = '';
    this.Owner = '';
    this.CUIT_PREF = '';
    this.Address = '';
    this.COD_PRO = '';
    this.DESC_PROV = '';
    this.COD_DPT = '';
    this.DESC_DPT = '';
    this.COD_LOC = '';
    this.DESC_LOC = '';
    this.City = '';
    this.Zip = '';
    this.Year_Model = '';
    this.CodCar = '';
    this.CountryFA = '';
    this.CountryPR = '';
    this.Weight = '';
    this.CUIT = '';
  }
}

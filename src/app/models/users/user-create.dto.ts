import { Base } from '../base.model';

export class UserCreateDto extends Base {
  autoId?: number;
  roleId: string;
  userName?: string;
  password?: string;
  pin?: string | null;
  biometric?: string | null;
  name: string;
  surname: string;
  birthdate?: string;
  email: string;
  phoneCountryCode?: string;
  phoneAreaCode?: string;
  phoneNumber?: string;
  fullPhoneNumber?: string;
  photo?: string;
  dni: string;
  isDeleted?: boolean

  constructor() {
    super();
    this.roleId = '';
    this.name = '';
    this.surname = '';
    this.email = '';
    this.dni = '';
  }
}

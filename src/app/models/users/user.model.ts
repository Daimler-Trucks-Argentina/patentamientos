import { Base } from '../base.model';
import { Role } from '../roles/role';

export class User extends Base {
  autoId?: number | null;
  userCode?: string | null;
  userName: string | null;
  password: string | null;
  pin?: string | null;
  biometric?: string | null;
  name: string | null;
  surname: string | null;
  email?: string | null;
  phone?: string | null;
  token?: string | null;
  dni: string | null;
  profilePhoto?: string | null;
  birthdate?: Date | null;
  displayName: string;
  role: Role | null;
  roleId: string | null;

  constructor() {
    super();
    this.autoId = 0;
    this.userCode = null;
    this.userName = null;
    this.password = null;
    this.pin = null;
    this.biometric = null;
    this.name = null;
    this.surname = null;
    this.email = null;
    this.phone = null;
    this.token = null;
    this.dni = null;
    this.profilePhoto = null;
    this.birthdate = null;
    this.displayName = '-';
    this.role = null;
    this.roleId = null;
  }
}

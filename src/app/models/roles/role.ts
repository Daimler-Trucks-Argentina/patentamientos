import { Base } from '../base.model';
import { Permission } from '../permissions/permission.model';

export class Role extends Base {
  autoId: number | null;
  name: string;
  description: string;
  isDeleted: boolean;
  permissions: Permission[];
  isAllPermissionsChecked: boolean;

  constructor() {
    super();
    this.autoId = 0;
    this.name = '';
    this.description = '';
    this.isDeleted = false;
    this.permissions = [];
    this.isAllPermissionsChecked = false
  }
}
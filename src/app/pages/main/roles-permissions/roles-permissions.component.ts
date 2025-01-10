import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { PermissionService } from 'src/app/services/permissions/permission.service';
import { RoleService } from 'src/app/services/roles/role.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { Role } from 'src/app/models/roles/role';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { Permission } from 'src/app/models/permissions/permission.model';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss'],
})
export class RolesPermissionsComponent implements OnInit, OnDestroy {
  TAG = Component.name;
  private unsubscribeAll: Subject<any> = new Subject();
  roles: Role[] = [];
  permissions: Permission[] = [];
  indexExpanded: number = 0;
  RolePermision: any;
  roleId: string;
  isLoading = true;

  constructor(
    private router: Router,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.roleId = '';
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll?.next(null);
    this.unsubscribeAll?.complete();
  }

  getData() {
    this.isLoading = true;
    const $combineLatest = combineLatest([this.roleService.getAll3()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([roles]) => {
        console.log(`${this.TAG} > getData > roles`, roles);
        this.roles = roles;
        this.expandRole();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(`${this.TAG} > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        this.isLoading = false;
      },
    });
  }

  expandRole() {
    const index = this.roles.findIndex((r) => r.id == this.roleId);
    this.indexExpanded = index;
    this.getPermissionsByRoleId(this.roleId);
  }

  getPermissionsByRoleId(roleId: string | null) {
    this.isLoading = true;
    const index = this.roles.findIndex((r) => r.id == roleId);
    this.indexExpanded = index;
    let role = this.roles.find((r) => r.id == roleId);
    if (!role || role.permissions.length > 0) {
      this.isLoading = false;
      return;
    }
    this.permissionService.getByRoleId(roleId).subscribe({
      next: (response) => {
        if (role) {
          role.permissions = response;
          this.checkIfIsAllPermissionsChecked(role);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error(`${this.TAG} > getPermissionsByRoleId > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        this.isLoading = false;
      },
    });
  }

  checkIfIsAllPermissionsChecked(role: Role, permission?: Permission) {
    console.log('rol', role, 'permisson', permission);
    if (permission) {
      permission.granted = !permission.granted;
    }
    let isAllPermissionsChecked = true;
    for (const permission of role.permissions) {
      if (!permission.granted) {
        isAllPermissionsChecked = false;
        break;
      }
    }
    role.isAllPermissionsChecked = isAllPermissionsChecked;
  }

  checkToggle(role: Role) {
    // console.log('RolesAndPermissionsComponent > checkToggle > role', role);
    role.isAllPermissionsChecked = !role.isAllPermissionsChecked;
    for (const permission of role.permissions) {
      if (permission.id != 'PAGES_HOME') {
        permission.granted = role.isAllPermissionsChecked;
      }
    }
  }

  saveChanges(rol: Role, $event: any) {
    $event.preventDefault();
    $event.stopPropagation();
    this.isLoading = true;
    console.log(`${this.TAG} > saveChanges > role`, rol);
    this.roleService.updatePermissions(rol).subscribe({
      next: (response) => {
        console.log(`${this.TAG} > saveChanges > role > response`, response);
        Toast.fire({
          icon: 'success',
          title: '¡Cambios guardados correctamente!',
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(`${this.TAG} > saveChanges > role > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        this.isLoading = false;
      },
    });
  }

  createOrUpdateRole(role?: Role) {
    this.router.navigate([
      '/pages/main/security/roles-and-permissions/role',
      { id: role ? role.id : uuidv4() },
    ]);
  }

  close() {
    this.router.navigate(['pages/main']);
  }
}

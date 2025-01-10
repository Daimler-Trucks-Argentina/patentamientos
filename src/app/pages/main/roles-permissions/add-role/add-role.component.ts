import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _MatCheckboxRequiredValidatorModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Role } from 'src/app/models/roles/role';
import { RoleCreateDto } from 'src/app/models/roles/role-create.dto';
import { RoleService } from 'src/app/services/roles/role.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent implements OnInit {
  TAG = AddRoleComponent.name;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  role: Role;
  roleId: string;
  isLoading = true;
  private unsubscribeAll: Subject<any>;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.formGroup = this.createFormGroup();
    this.roleId = this.route.snapshot.paramMap.get('id') ?? '';
    this.actionMode = ActionMode.create;
    this.role = new Role();
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getData();
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      name: [
        this.role ? this.role.name : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(128),
        ]),
      ],
      description: [
        this.role ? this.role.description : '',
        Validators.compose([Validators.required, Validators.maxLength(512)]),
      ],
    });
    return formGroup;
  }

  close() {
    this.router.navigate(['/pages/main/security/roles-and-permissions']);
  }

  getData() {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this.roleService.getById(this.roleId),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([role]) => {
        if (role) {
          this.role = role;
          this.actionMode = ActionMode.update;
          this.formGroup = this.createFormGroup();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(`${this.TAG} > getPermissionsByRoleId > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        this.isLoading = false;
      },
    });
  }

  createOrUpdateRole() {
    this.isLoading = true;
    const rawValue = this.formGroup.getRawValue();
    const name = rawValue.name;
    const description = rawValue.description;
    const roleCreateDto: RoleCreateDto = {
      id: this.roleId ?? '',
      name: name,
      description: description,
    };
    console.log(roleCreateDto);
    if (this.actionMode === ActionMode.create) {
      this.roleService.create(roleCreateDto).subscribe({
        next: (response) => {
          Toast.fire({
            icon: 'success',
            title: '¡Rol creado con éxito!',
          });
          this.isLoading = false;
          this.router.navigate(['/pages/main/security/roles-and-permissions']);
        },
        error: (err) => {
          console.error(`${this.TAG} > save > create > err`, err);
          const error = ErrorHelper.getErrorMessage(err);
          this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
          this.isLoading = false;
        },
      });
    }
    if (this.actionMode == ActionMode.update) {
      this.roleService.update(roleCreateDto).subscribe({
        next: (response) => {
          Toast.fire({
            icon: 'success',
            title: '¡Rol actualizado correctamente!',
          });
          this.isLoading = false;
          this.router.navigate(['/pages/main/security/roles-and-permissions']);
        },
        error: (err) => {
          console.error(`${this.TAG} > save > update > err`, err);
          const error = ErrorHelper.getErrorMessage(err);
          this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
          this.isLoading = false;
        },
      });
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { matchValidator } from 'src/app/core/validators/match.validator';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Role } from 'src/app/models/roles/role';
import { SecurityParameter } from 'src/app/models/security-parameters/security-parameter.model';
import { UserCreateDto } from 'src/app/models/users/user-create.dto';
import { User } from 'src/app/models/users/user.model';
import { RoleService } from 'src/app/services/roles/role.service';
import { SecurityParameterService } from 'src/app/services/security-parameters/security-parameters.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  TAG = 'AddUserComponent';
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  private unsubscribeAll: Subject<any>;
  roles: Role[] = [];
  hide = false;
  show = false;
  userId: string;
  user: User;
  securityParameter = new SecurityParameter();
  passwordTooltip =
    'Entre 6 y 12 caracteres, al menos una mayúscula,una minúscula y un número, SIN caracteres especiales.';
  specialCharPattern = /[~`!#$%^&*+=[\]';,\/{}|\\":<>?-]/;
  isLoading = true;
  @ViewChild('passTooltip') passTooltip!: MatTooltip;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _userService: UserService,
    private _roleService: RoleService,
    private securityParameterService: SecurityParameterService,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.unsubscribeAll = new Subject();
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';
    this.user = new User();
    this.user.id = this.userId;
    this.actionMode = ActionMode.create;
    this.formGroup = this.createFormGroup();
  }

  ngOnInit(): void {
    this.getData();
  }

  regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | any => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  createFormGroup(): FormGroup {
    const passwordValidators =
      this.actionMode === ActionMode.update
        ? []
        : Validators.compose([
            Validators.required,
            this.securityParameter.minCharacters
              ? Validators.minLength(this.securityParameter.minCharacters)
              : Validators.minLength(2),
            this.securityParameter.maxCharacters
              ? Validators.maxLength(this.securityParameter.maxCharacters)
              : null,
            this.securityParameter.includeCapitalLetter
              ? this.regexValidator(new RegExp('[A-Z]'), { CL: true })
              : null,
            this.securityParameter.includeNumbers
              ? this.regexValidator(new RegExp('[0-9]'), { IN: true })
              : null,
            this.securityParameter.includeSpecialCharacters
              ? this.regexValidator(new RegExp(this.specialCharPattern), {
                  SC: true,
                })
              : null,
          ]);
    const confirmPasswordValidators =
      this.actionMode === ActionMode.update
        ? []
        : [Validators.required, matchValidator('password')];
    const formGroup = this.formBuilder.group({
      dni: [
        this.user ? this.user.dni : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(16),
        ]),
      ],
      name: [
        this.user ? this.user.name : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
        ]),
      ],
      lastName: [
        this.user ? this.user.surname : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ]),
      ],
      mail: [
        { value: this.user ? this.user.email : '', disabled: false },
        [
          Validators.required,
          Validators.pattern(
            '^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$'
          ),
        ],
      ],
      role: [
        this.user ? this.user.roleId : '',
        Validators.compose([Validators.required]),
      ],
      username: [
        {
          value: this.user ? this.user.userName : '',
          disabled: this.actionMode === ActionMode.update,
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ]),
      ],
      password: [
        {
          value: null,
          disabled: this.actionMode === ActionMode.update,
        },
        passwordValidators,
      ],
      confirmPass: [
        {
          value: null,
          disabled: this.actionMode === ActionMode.update,
        },
        confirmPasswordValidators,
      ],
    });
    return formGroup;
  }

  getData() {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this._userService.getById(this.userId),
      this._roleService.getAll(),
      this.securityParameterService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([user, roles, securityParameter]) => {
        this.roles = roles;
        if (user) {
          this.user = user;
          this.user.password = null;
          this.user.pin = null;
          this.actionMode = ActionMode.update;
          this.formGroup = this.createFormGroup();
        }
        if (securityParameter.length > 0) {
          this.securityParameter = securityParameter[0];
          const capitalLetter = this.securityParameter.includeCapitalLetter
            ? 'al menos una mayúscula'
            : 'sin mayúscula';
          const numbers = this.securityParameter.includeNumbers
            ? 'y un número'
            : 'sin números';
          const specialChar = this.securityParameter.includeSpecialCharacters
            ? 'al menos un caracter especial'
            : 'sin caracteres especiales.';
          this.passwordTooltip = `Entre ${this.securityParameter.minCharacters} y ${this.securityParameter.maxCharacters} caracteres,
          ${capitalLetter}, una minúscula ${numbers}, ${specialChar}`;
        }
        this.formGroup = this.createFormGroup();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(`${this.TAG} > save > create > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        this.isLoading = false;
      },
    });
  }

  close() {
    this.router.navigate(['pages/main/security/users']);
  }

  save() {
    console.log(`${this.TAG} > save`);
    const rawValue = this.formGroup.getRawValue();
    console.log(`${this.TAG} > save > rawValue`, rawValue);
    const userDto: UserCreateDto = {
      id: this.userId ?? '',
      roleId: rawValue.role,
      userName: rawValue.username,
      password: rawValue.password,
      name: rawValue.name,
      surname: rawValue.lastName,
      email: rawValue.mail,
      dni: rawValue.dni,
    };
    if (this.actionMode === ActionMode.create) {
      this.create(userDto);
    }
    if (this.actionMode === ActionMode.update) {
      this.update(userDto);
    }
  }

  create(createDto: UserCreateDto) {
    this.isLoading = true;
    this._userService.create(createDto).subscribe({
      next: (response) => {
        Toast.fire({
          icon: 'success',
          title: '¡Usuario creado con éxito!',
        });
        this.isLoading = false;
        this.router.navigate(['pages/main/security/users']);
      },
      error: (err) => {
        console.error(`${this.TAG} > save > create > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        this.isLoading = false;
      },
    });
  }

  update(createDto: UserCreateDto) {
    this.isLoading = true;
    this._userService.update(createDto).subscribe({
      next: (response) => {
        Toast.fire({
          icon: 'success',
          title: '¡Usuario editado con éxito!',
        });
        this.isLoading = false;
        this.router.navigate(['pages/main/security/users']);
      },
      error: (err) => {
        console.error(`${this.TAG} > save > create > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        this.isLoading = false;
      },
    });
  }
}

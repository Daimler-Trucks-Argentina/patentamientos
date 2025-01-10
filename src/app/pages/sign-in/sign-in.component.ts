import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { SignInDto } from 'src/app/models/sign-in/sign-in.dto';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PermissionService } from 'src/app/services/permissions/permission.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  TAG = 'SignInComponent';
  formGroup: FormGroup;
  private unsubscribeAll: Subject<any>;
  isXsOrSm = false;
  hide = false;
  loading = false;
  signButton = 'Ingresar';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver
  ) {
    this.unsubscribeAll = new Subject();
    this.formGroup = this.createFormGroup();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll?.next(null);
    this.unsubscribeAll?.complete();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((state: BreakpointState) => {
        console.log(
          `${this.TAG} > ngOnInit > breakpointObserver > state`,
          state
        );
        if (state.matches) {
          this.isXsOrSm = true;
        } else {
          this.isXsOrSm = false;
        }
      });
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      userName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
        ]),
      ],
    });
    return formGroup;
  }

  signIn() {
    this.signButton = '';
    this.loading = true;
    const signInDto: SignInDto = this.formGroup.getRawValue();

    if (this.formGroup.invalid) {
      return;
    }
    if (!signInDto || !signInDto.userName || !signInDto.password) {
      return;
    }

    this.authService
      .signIn(signInDto)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe({
        next: (response) => {
          console.log(`${this.TAG} > signIn > response`, response);
          this.authService.userObservable
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe({
              next: (user) => {
                if (response && user && user.token) {
                  this.permissionService
                    .getGranted(response.roleId)
                    .pipe(takeUntil(this.unsubscribeAll))
                    .subscribe({
                      next: (permissions) => {
                        this.loading = false;
                        this.signButton = 'Ingresar';
                        this.router.navigate([`/pages/main/file-list`]);
                      },
                      error: (err) => {
                        console.error(`${this.TAG} > signIn > error`, err);
                        const error = ErrorHelper.getErrorMessage(err);
                        this.sweetAlert.error(
                          'Ha ocurrido un error!',
                          error,
                          null,
                          true
                        );
                        this.loading = false;
                        this.signButton = 'Ingresar';
                      },
                    });
                } else {
                  this.loading = false;
                  this.signButton = 'Ingresar';
                }
              },
            });
        },
        error: (err) => {
          console.error(`${this.TAG} > signIn > error`, err);
          const error = ErrorHelper.getErrorMessage(err);
          this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
          this.loading = false;
          this.signButton = 'Ingresar';
        },
      });
  }
}

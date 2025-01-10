import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityParameterService } from 'src/app/services/security-parameters/security-parameters.service';
import { SecurityParameter } from 'src/app/models/security-parameters/security-parameter.model';
import { Router } from '@angular/router';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
})
export class ParametersComponent implements OnInit {
  TAG = 'ParameterComponent';
  private unsubscribeAll: Subject<any> = new Subject();
  formGroup: FormGroup;
  securityParameter: SecurityParameter;
  actionMode: ActionMode;
  isXsOrSm = false;
  isLoading = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private securityParameterService: SecurityParameterService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.formGroup = this.createFormGroup();
    this.actionMode = ActionMode.update;
    this.securityParameter = new SecurityParameter();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
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
    this.getData();
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      sessionTime: [
        {
          value: this.securityParameter
            ? this.securityParameter.sessionTime
            : '',
          disabled: false,
        },
        Validators.compose([Validators.required, Validators.max(60)]),
      ],
      numberLogins: [
        {
          value: this.securityParameter
            ? this.securityParameter.numberLogins
            : '',
          disabled: false,
        },
        Validators.compose([Validators.required, Validators.max(10)]),
      ],
      characterMin: [
        {
          value: this.securityParameter
            ? this.securityParameter.minCharacters
            : '',
          disabled: false,
        },
        Validators.compose([Validators.required, Validators.max(19)]),
      ],
      characterMax: [
        {
          value: this.securityParameter
            ? this.securityParameter.maxCharacters
            : '',
          disabled: false,
        },
        Validators.compose([Validators.required, Validators.max(20)]),
      ],
      cbIncludeCapitalLetter: [
        {
          value: this.securityParameter
            ? this.securityParameter.includeCapitalLetter
            : false,
          disabled: false,
        },
      ],
      cbIncludeNumbers: [
        {
          value: this.securityParameter
            ? this.securityParameter.includeNumbers
            : false,
          disabled: false,
        },
      ],
      cbIncludeSpecialCharacters: [
        {
          value: this.securityParameter
            ? this.securityParameter.includeSpecialCharacters
            : false,
          disabled: false,
        },
      ],
    });
    return formGroup;
  }

  getData(): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this.securityParameterService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([securityParameter]) => {
        console.log(
          `${this.TAG} > getData > securityParameter`,
          securityParameter
        );
        if (securityParameter.length > 0) {
          this.securityParameter = securityParameter[0];
          this.formGroup = this.createFormGroup();
        }
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

  onChange(ev: any, isMin: boolean) {
    let min = 0;
    let max = 0;
    if (isMin) {
      max = +this.formGroup.get('characterMax')?.value;
      min = +ev.target.value;
      if (min >= max) {
        this.formGroup.get('characterMin')?.setValue(max - 1);
        ev.preventDefault();
      }
    } else {
      min = +this.formGroup.get('characterMin')?.value;
      max = +ev.target.value;
      if (max <= min) {
        this.formGroup.get('characterMax')?.setValue(min + 1);
        ev.preventDefault();
      }
    }
  }

  updateParameters() {
    this.isLoading = true;
    const values = this.formGroup.getRawValue();
    const securityParameter = new SecurityParameter();
    (securityParameter.id = this.securityParameter.id),
      (securityParameter.includeCapitalLetter = values.cbIncludeCapitalLetter);
    securityParameter.includeNumbers = values.cbIncludeNumbers;
    securityParameter.includeSpecialCharacters =
      values.cbIncludeSpecialCharacters;
    securityParameter.maxCharacters = values.characterMax;
    securityParameter.minCharacters = values.characterMin;
    securityParameter.sessionTime = values.sessionTime;
    securityParameter.numberLogins = values.numberLogins;
    this.securityParameterService
      .edit(securityParameter.id!, securityParameter)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          Toast.fire({
            icon: 'success',
            title: '¡Parametros guardados!',
          });
        },
        error: (err) => {
          console.error(`${this.TAG} > save > update > err`, err);
          const error = ErrorHelper.getErrorMessage(err);
          this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
          this.isLoading = false;
        },
      });
  }

  close() {
    this.router.navigate(['pages/main']);
  }
}

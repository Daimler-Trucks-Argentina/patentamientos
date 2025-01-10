import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { RegSecCreateUpdateDto } from 'src/app/models/reg-secs/reg-sec-create-update.dto';
import { RegSec } from 'src/app/models/reg-secs/reg-sec.model';
import { RegSecService } from 'src/app/services/reg-secs/reg-sec.service';
import { v4 } from 'uuid';

export interface DialogData {
  regSec: RegSec;
  regSecId: string;
}
@Component({
  selector: 'app-reg-sec-dialog',
  templateUrl: './reg-sec-dialog.component.html',
  styleUrls: ['./reg-sec-dialog.component.scss'],
})
export class RegSecDialogComponent implements OnInit {
  TAG = 'RegSecDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  regSec: RegSec = new RegSec();
  isLoading = false;
  loadingSelect = false;

  constructor(
    private dialogRef: MatDialogRef<RegSecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,

    private formBuilder: FormBuilder,
    public regSecService: RegSecService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.regSec = data.regSec;
    console.log(`${this.TAG} > constructor > this.regSec`, this.regSec);
    if (this.regSec.id) {
      this.actionMode = ActionMode.update;
      this.formGroup = this.createFormGroup();
    } else {
      this.actionMode = ActionMode.create;
      this.formGroup = this.createFormGroup();
    }
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
      name: [
        {
          value: this.regSec.name ?? null,
          disabled: false,
        },
      ],
      description: [
        {
          value: this.regSec.description ?? null,
          disabled: false,
        },
        [],
      ],
      registryNumber: [
        {
          value: this.regSec.registryNumber ?? null,
          disabled: false,
        },
      ],
      registryProvince: [
        {
          value: this.regSec.registryProvince ?? null,
          disabled: false,
        },
        [],
      ],
      registryDepartment: [
        {
          value: this.regSec.registryDepartment ?? null,
          disabled: false,
        },
        [],
      ],
      registryLocation: [
        {
          value: this.regSec.registryLocation ?? null,
          disabled: false,
        },
        [],
      ],
      autoZoneDealer: [
        {
          value: this.regSec.autoZoneDealer ?? null,
          disabled: false,
        },
        [],
      ],
      autoZoneDescription: [
        {
          value: this.regSec.autoZoneDescription ?? null,
          disabled: false,
        },
        [],
      ],
      truckZoneDealer: [
        {
          value: this.regSec.truckZoneDealer ?? null,
          disabled: false,
        },
        [],
      ],
      truckZoneDescription: [
        {
          value: this.regSec.truckZoneDescription ?? null,
          disabled: false,
        },
        [],
      ],
      vanZoneDealer: [
        {
          value: this.regSec.vanZoneDealer ?? null,
          disabled: false,
        },
        [],
      ],
      vanZoneDescription: [
        {
          value: this.regSec.vanZoneDescription ?? null,
          disabled: false,
        },
        [],
      ],
    });
    return formGroup;
  }

  compareFn(v1: any, v2: any): boolean {
    return v1 && v2 ? v1.id === v2.id : v1 === v2;
  }

  save() {
    this.loading = true;
    this.accept = '';
    const rawValue = this.formGroup.getRawValue();
    console.log(`${this.TAG} > save > rawValue`, rawValue);
    const createDto: RegSecCreateUpdateDto = {
      id: this.regSec.id ?? v4(),
      name: rawValue.name,
      description: rawValue.description,
      registryNumber: rawValue.registryNumber,
      registryProvince: rawValue.registryProvince,
      registryDepartment: rawValue.registryDepartment,
      registryLocation: rawValue.registryLocation,
      autoZoneDealer: rawValue.autoZoneDealer,
      autoZoneDescription: rawValue.autoZoneDescription,
      truckZoneDealer: rawValue.truckZoneDealer,
      truckZoneDescription: rawValue.truckZoneDescription,
      vanZoneDealer: rawValue.vanZoneDealer,
      vanZoneDescription: rawValue.vanZoneDescription,
    };
    console.log('createDto', createDto);
    if (this.actionMode === ActionMode.create) {
      this.create(createDto);
    }
    if (this.actionMode === ActionMode.update) {
      this.update(createDto);
    }
  }

  create(createDto: RegSecCreateUpdateDto): void {
    this.regSecService.create(createDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Registro guardado con éxito!',
        });
      },
      error: (err) => {
        this.loading = false;
        this.accept = 'Guardar';
        console.error(`${this.TAG} > save > create > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  update(updateDto: RegSecCreateUpdateDto): void {
    this.regSecService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Registro actualizado con éxito!',
        });
      },
      error: (err) => {
        this.loading = false;
        this.accept = 'Guardar';
        console.error(`${this.TAG} > save > update > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }
}

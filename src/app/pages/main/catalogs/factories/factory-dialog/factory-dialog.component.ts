import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { FactoryCreateUpdateDto } from 'src/app/models/factories/factory-create-update.dto';
import { Factory } from 'src/app/models/factories/factory.model';
import { FactoryService } from 'src/app/services/factories/factory.service';
import { v4 as uuidv4 } from 'uuid';
import { BrandDialogComponent } from '../../brands/brand-dialog/brand-dialog.component';

export interface DialogData {
  factory: Factory;
  factoryId: string;
}
@Component({
  selector: 'app-factory-dialog',
  templateUrl: './factory-dialog.component.html',
  styleUrls: ['./factory-dialog.component.scss'],
})
export class FactoryDialogComponent {
  TAG = 'FactoryDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  factory: Factory = new Factory();

  constructor(
    private dialogRef: MatDialogRef<BrandDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public factoryService: FactoryService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.factory = data.factory;
    console.log(`${this.TAG} > constructor > this.brand`, this.factory);
    if (this.factory.id) {
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
      mercedesFabricaId: [
        {
          value: this.factory.mercedesFabricaId ?? null,
          disabled: false,
        },
        [Validators.required],
      ],
      name: [
        {
          value: this.factory.name ?? null,
          disabled: false,
        },
        [Validators.required],
      ],
      description: [
        {
          value: this.factory.description ?? null,
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
    const createDto: FactoryCreateUpdateDto = {
      id: this.factory.id ?? uuidv4(),
      mercedesFabricaId: rawValue.mercedesFabricaId,
      name: rawValue.name,
      description: rawValue.description,
    };
    if (this.actionMode === ActionMode.create) {
      this.create(createDto);
    }
    if (this.actionMode === ActionMode.update) {
      this.update(createDto);
    }
  }

  create(createDto: FactoryCreateUpdateDto): void {
    this.factoryService.create(createDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Fábrica guardada con éxito!',
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

  update(updateDto: FactoryCreateUpdateDto): void {
    this.factoryService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Fábrica actualizada con éxito!',
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

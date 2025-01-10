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
import { InternalVersionSegmentation } from 'src/app/models/internal-version-segmentations/internal-version-segmentation.model';
import { KeyVersionCreateDto } from 'src/app/models/key-versions/key-version-create.dto';
import { KeyVersion } from 'src/app/models/key-versions/key-version.model';
import { KeyVersionService } from 'src/app/services/key-versions/key-version.service';
import { v4 as uuidv4 } from 'uuid';

export interface DialogData {
  keyVersion: KeyVersion;
  keyVersionId: string;
  internalVersionSegmentations: InternalVersionSegmentation[];
}
@Component({
  selector: 'app-key-version-dialog',
  templateUrl: './key-version-dialog.component.html',
  styleUrls: ['./key-version-dialog.component.scss'],
})
export class KeyVersionDialogComponent implements OnInit {
  TAG = 'KeyVersionDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  keyVersion: KeyVersion = new KeyVersion();
  isLoading = false;
  loadingSelect = false;
  internalVersionSegmentations: InternalVersionSegmentation[];

  constructor(
    private dialogRef: MatDialogRef<KeyVersionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,

    private formBuilder: FormBuilder,
    public keyVersionService: KeyVersionService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.keyVersion = data.keyVersion;
    this.internalVersionSegmentations = data.internalVersionSegmentations;
    console.log(`${this.TAG} > constructor > this.keyVersion`, this.keyVersion);
    if (this.keyVersion.id) {
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
      mercedesTerminalId: [
        {
          value: this.keyVersion.mercedesTerminalId ?? null,
          disabled: false,
        },
      ],
      mercedesMarcaId: [
        {
          value: this.keyVersion.mercedesMarcaId ?? null,
          disabled: false,
        },
        [],
      ],
      mercedesModeloId: [
        {
          value: this.keyVersion.mercedesModeloId ?? null,
          disabled: false,
        },
      ],
      internalVersionSegmentationId: [
        {
          value: this.keyVersion.internalVersionSegmentationId ?? null,
          disabled: false,
        },
        [],
      ],
      mercedesVersionInternaSegmentacionId: [
        {
          value: this.keyVersion.mercedesVersionInternaSegmentacionId ?? null,
          disabled: false,
        },
        [],
      ],
      mercedesVersionClaveId: [
        {
          value: this.keyVersion.mercedesVersionClaveId ?? null,
          disabled: false,
        },
        [],
      ],
      dateTo: [
        {
          value: this.keyVersion.dateTo ?? null,
          disabled: false,
        },
        [],
      ],
      dateFrom: [
        {
          value: this.keyVersion.dateFrom ?? null,
          disabled: false,
        },
        [],
      ],
      descriptionShort: [
        {
          value: this.keyVersion.descriptionShort ?? null,
          disabled: false,
        },
        [],
      ],
      descriptionLong: [
        {
          value: this.keyVersion.descriptionLong ?? null,
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
    const createDto: KeyVersionCreateDto = {
      id: this.keyVersion.id ?? uuidv4(),
      mercedesTerminalId: rawValue.mercedesTerminalId,
      mercedesMarcaId: rawValue.mercedesMarcaId,
      mercedesModeloId: rawValue.mercedesModeloId,
      internalVersionSegmentationId: rawValue.internalVersionSegmentationId,
      mercedesVersionInternaSegmentacionId:
        rawValue.mercedesVersionInternaSegmentacionId,
      mercedesVersionClaveId: rawValue.mercedesVersionClaveId,
      dateTo: rawValue.dateTo,
      dateFrom: rawValue.dateFrom,
      descriptionShort: rawValue.descriptionShort,
      descriptionLong: rawValue.descriptionLong,
    };
    console.log('createDto', createDto);
    if (this.actionMode === ActionMode.create) {
      this.create(createDto);
    }
    if (this.actionMode === ActionMode.update) {
      this.update(createDto);
    }
  }

  create(createDto: KeyVersionCreateDto): void {
    this.keyVersionService.create(createDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Versión clave guardada con éxito!',
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

  update(updateDto: KeyVersionCreateDto): void {
    this.keyVersionService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Versión clave actualizada con éxito!',
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

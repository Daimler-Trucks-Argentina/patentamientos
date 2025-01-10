import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxMatSelectionChangeEvent } from 'ngx-mat-select';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Brand } from 'src/app/models/brands/brand.model';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { CatInternalVersionCreateDto } from 'src/app/models/cat-internal-versions/cat-internal-version-create.dto';
import { CatInternalVersion } from 'src/app/models/cat-internal-versions/cat-internal-versions.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { CatInternalVersionService } from 'src/app/services/cat-internal-versions/cat-internal-versions.service';
import { v4 as uuidv4 } from 'uuid';

export interface DialogData {
  catInternalVersion: CatInternalVersion;
  terminals: Terminal[];
  brands: Brand[];
  carModels: CarModel[];
  carModel?: CarModel;
}
@Component({
  selector: 'app-internal-version-dialog',
  templateUrl: './internal-version-dialog.component.html',
  styleUrls: ['./internal-version-dialog.component.scss'],
})
export class InternalVersionDialogComponent implements OnInit {
  TAG = 'InternalVersionDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  catInternalVersion: CatInternalVersion = new CatInternalVersion();
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  brandId: string = '';
  carModels: CarModel[] = [];
  carModel: CarModel = new CarModel();
  filteredCarModels: CarModel[] = [];
  terminals: Terminal[] = [];
  terminalId: string = '';
  lastId: number = 0;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<InternalVersionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public internalVersionService: CatInternalVersionService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.catInternalVersion = data.catInternalVersion;
    this.terminals = data.terminals;
    this.brands = data.brands;
    this.carModels = data.carModels;

    if (this.catInternalVersion.id) {
      this.actionMode = ActionMode.update;
      this.formGroup = this.createFormGroup();
    } else {
      if (data.carModel) {
        this.catInternalVersion = new CatInternalVersion();
        this.carModel = data.carModel;
        this.catInternalVersion.mercedesTerminalId =
          data.carModel.mercedesTerminalId;
        this.catInternalVersion.mercedesMarcaId = data.carModel.mercedesMarcaId;
      }
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
    this.filteredBrands = this.brands.filter(
      (b) => b.mercedesTerminalId === this.catInternalVersion.mercedesTerminalId
    );
    this.filteredCarModels = this.carModels.filter(
      (c) =>
        c.mercedesTerminalId === this.catInternalVersion.mercedesTerminalId &&
        c.mercedesMarcaId === this.catInternalVersion.mercedesMarcaId
    );
    if (this.data.carModel) {
      this.formGroup
        .get('terminalId')
        ?.setValue(this.carModel.brand?.terminalId);
      this.formGroup.get('marcaId')?.setValue(this.carModel.brandId);
      this.formGroup.get('carModelId')?.setValue(this.carModel.id);
    }
    if (this.actionMode === ActionMode.create) {
      this.getLastId();
    }
  }

  getLastId() {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this.internalVersionService.getLastId(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([lastId]) => {
        console.log(`${this.TAG} > getData > id`, lastId);
        this.lastId = lastId!;
        this.formGroup.get('terminalId')?.disable();
        this.formGroup.get('marcaId')?.disable();
        this.formGroup.get('carModelId')?.disable();
        this.formGroup.get('version')?.disable();
        this.formGroup.controls['version']?.setValue(this.lastId + 1);
        if (this.lastId >= 9999) {
          this.sweetAlert.error(
            '¡Máxima cantidad de versiones internas!',
            'La numeración llegó al límite máximo: "9999".',
            null,
            true
          );
          this.formGroup.disable();
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`category > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createFormGroup(): FormGroup {
    const validoDesdeStr = this.catInternalVersion.dateFrom?.toString();
    const validoDesde = new Date(validoDesdeStr!);
    validoDesde.setHours(validoDesde.getHours() + 4);

    const validoHastaStr = this.catInternalVersion.dateTo?.toString();
    const validoHasta = new Date(validoHastaStr!);
    validoHasta.setHours(validoHasta.getHours() + 4);

    const formGroup = this.formBuilder.group({
      terminalId: [
        {
          value: this.catInternalVersion
            ? this.catInternalVersion.carModel?.brand?.terminalId
            : null,
          disabled: true,
        },
        [],
      ],
      marcaId: [
        {
          value: this.catInternalVersion
            ? this.catInternalVersion.carModel?.brandId
            : null,
          disabled: true,
        },
        [],
      ],
      carModelId: [
        {
          value: this.catInternalVersion
            ? this.catInternalVersion.carModelId
            : null,
          disabled: true,
        },
        [Validators.required],
      ],
      version: [
        {
          value: this.catInternalVersion
            ? this.catInternalVersion.version
            : null,
          disabled: false,
        },
        [Validators.required],
      ],
      description: [
        {
          value: this.catInternalVersion
            ? this.catInternalVersion.description
            : null,
          disabled: false,
        },
        [Validators.required],
      ],

      dateTo: [
        {
          value: isNaN(validoHasta.valueOf())
            ? new Date('9999-12-31T06:00:00Z')
            : validoHasta,
          disabled: false,
        },
        [Validators.required],
      ],
      dateFrom: [
        {
          value: isNaN(validoDesde.valueOf())
            ? new Date('1000-01-01T06:00:00Z')
            : validoDesde,
          disabled: false,
        },
        [Validators.required],
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
    const carModel = this.carModels.find((cm) => cm.id == rawValue.carModelId);
    console.log(`${this.TAG} > save > rawValue`, rawValue);
    const createDto: CatInternalVersionCreateDto = {
      id: this.catInternalVersion.id ?? uuidv4(),
      mercedesTerminalId: carModel?.mercedesTerminalId,
      mercedesMarcaId: carModel?.mercedesMarcaId,
      mercedesModeloId: carModel?.mercedesModeloId,
      carModelId: carModel?.id!,
      version: rawValue.version,
      description: rawValue.description,
      dateFrom: rawValue.dateFrom,
      dateTo: rawValue.dateTo,
    };
    console.log('createDto', createDto);
    if (this.actionMode === ActionMode.create) {
      this.create(createDto);
    }
    if (this.actionMode === ActionMode.update) {
      this.update(createDto);
    }
  }

  create(createDto: CatInternalVersionCreateDto): void {
    this.internalVersionService.create(createDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Versión interna guardada con éxito!',
        });
      },
      error: (err) => {
        this.loading = false;
        this.accept = 'Guardar';
        console.error(`${this.TAG} > save > create > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('¡Ha ocurrido un error!', error, null, true);
      },
    });
  }

  update(updateDto: CatInternalVersionCreateDto): void {
    this.internalVersionService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Versión interna actualizada con éxito!',
        });
      },
      error: (err) => {
        this.loading = false;
        this.accept = 'Guardar';
        console.error(`${this.TAG} > save > update > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('¡Ha ocurrido un error!', error, null, true);
      },
    });
  }

  searchComparisonFn = (
    searchTerm: string,
    option: { codName: string }
  ): boolean => {
    return option.codName.toLowerCase().includes(searchTerm.toLowerCase());
  };

  filterBrands(event: NgxMatSelectionChangeEvent) {
    this.filteredBrands = [];
    this.filteredCarModels = [];
    this.terminalId = event.value as string;
    const terminal = this.terminals.find((t) => event.value == t.id);
    this.filteredBrands = this.brands.filter(
      (b) => terminal?.mercedesTerminalId == b.mercedesTerminalId
    );
    this.formGroup.get('marcaId')?.setValue(null);
    this.formGroup.get('modeloId')?.setValue(null);
  }

  filterModels(event: NgxMatSelectionChangeEvent) {
    this.filteredCarModels = [];
    this.brandId = event.value as string;
    const brand = this.brands.find((b) => event.value == b.id);
    this.filteredCarModels = this.carModels.filter(
      (cm) =>
        brand?.mercedesMarcaId == cm.mercedesMarcaId &&
        brand?.mercedesTerminalId == cm.mercedesTerminalId
    );
    this.formGroup.get('modeloId')?.setValue(null);
  }
}

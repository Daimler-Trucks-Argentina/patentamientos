import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxMatSelectionChangeEvent } from 'ngx-mat-select';
import { Subject } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Brand } from 'src/app/models/brands/brand.model';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { WholesaleVersionCreateDto } from 'src/app/models/wholesale-versions/wholesale-version-create.dto';
import { WholesaleVersion } from 'src/app/models/wholesale-versions/wholesale-version.model';
import { WholesaleVersionService } from 'src/app/services/wholesale-versions/wholesale-version.service';
export interface DialogData {
  wholesaleVersion: WholesaleVersion;
  terminals: Terminal[];
  brands: Brand[];
  carModels: CarModel[];
  carModel?: CarModel;
}

@Component({
  selector: 'app-wholesale-versions-dialog',
  templateUrl: './wholesale-versions-dialog.component.html',
  styleUrls: ['./wholesale-versions-dialog.component.scss'],
})
export class WholesaleVersionsDialogComponent {
  TAG = 'WholesaleVersionsDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  wholesaleVersion: WholesaleVersion = new WholesaleVersion();
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  brandId: string = '';
  carModels: CarModel[] = [];
  carModel: CarModel = new CarModel();
  filteredCarModels: CarModel[] = [];
  terminals: Terminal[] = [];
  terminalId: string = '';
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<WholesaleVersionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public wholesaleVersionService: WholesaleVersionService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.wholesaleVersion = data.wholesaleVersion;
    this.terminals = data.terminals;
    this.brands = data.brands;
    this.carModels = data.carModels

    if (this.wholesaleVersion.id) {
      this.actionMode = ActionMode.update;
      this.formGroup = this.createFormGroup();
    } else {
      if (data.carModel) {
        this.wholesaleVersion = new WholesaleVersion();
        this.carModel = data.carModel;
        this.wholesaleVersion.mercedesTerminalId =
          data.carModel.mercedesTerminalId;
        this.wholesaleVersion.mercedesMarcaId = data.carModel.mercedesMarcaId;
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
        (b) => b.mercedesTerminalId === this.wholesaleVersion.mercedesTerminalId
      );
      this.carModels = this.carModels;
      this.filteredCarModels = this.carModels.filter(
        (c) =>
          c.mercedesTerminalId === this.wholesaleVersion.mercedesTerminalId &&
          c.mercedesMarcaId === this.wholesaleVersion.mercedesMarcaId
      );

      if (this.data.carModel) {
        this.formGroup
          .get('terminalId')
          ?.setValue(this.carModel.brand?.terminalId);
        this.formGroup.get('marcaId')?.setValue(this.carModel.brandId);
        this.formGroup.get('modeloId')?.setValue(this.carModel.id);
      }
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      terminalId: [
        {
          value: this.wholesaleVersion
            ? this.wholesaleVersion.carModel?.brand?.terminalId
            : null,
          disabled: this.data.carModel ? true : false,
        },
        [],
      ],
      marcaId: [
        {
          value: this.wholesaleVersion
            ? this.wholesaleVersion.carModel?.brandId
            : null,
          disabled: this.data.carModel ? true : false,
        },
        [],
      ],
      modeloId: [
        {
          value: this.wholesaleVersion
            ? this.wholesaleVersion.carModelId
            : null,
          disabled: this.data.carModel ? true : false,
        },
        [Validators.required],
      ],
      version: [
        {
          value: this.wholesaleVersion ? this.wholesaleVersion.version : null,
          disabled: false,
        },
        [Validators.required],
      ],
      description: [
        {
          value: this.wholesaleVersion
            ? this.wholesaleVersion.description
            : null,
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
    console.log(`${this.TAG} > save > rawValue`, rawValue);
    const carModel = this.carModels.find((cm) => cm.id == rawValue.modeloId);
    const createDto: WholesaleVersionCreateDto = {
      id: this.wholesaleVersion.id!,
      mercedesTerminalId: carModel?.mercedesTerminalId,
      mercedesMarcaId: carModel?.mercedesMarcaId,
      mercedesModeloId: carModel?.mercedesModeloId,
      carModelId: carModel?.id!,
      version: rawValue.version,
      description: rawValue.description,
    };
    console.log('createDto', createDto);
    if (this.actionMode === ActionMode.create) {
      this.create(createDto);
    }
    if (this.actionMode === ActionMode.update) {
      this.update(createDto);
    }
  }

  create(createDto: WholesaleVersionCreateDto): void {
    this.wholesaleVersionService.create(createDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Versión wholesale guardada con éxito!',
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

  update(updateDto: WholesaleVersionCreateDto): void {
    this.wholesaleVersionService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Versión wholesale actualizada con éxito!',
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

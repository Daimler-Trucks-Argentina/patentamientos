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
import { CarModelCreateUpdateDto } from 'src/app/models/car-models/car-model-create-update.dto';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { CarModelService } from 'src/app/services/car-models/car-model.service';
import { v4 as uuidv4 } from 'uuid';

export interface DialogData {
  carModel: CarModel;
  carModelId: string;
  carModels: CarModel[];
  terminals: Terminal[];
  brands: Brand[];
}
@Component({
  selector: 'app-car-model-dialog',
  templateUrl: './car-model-dialog.component.html',
  styleUrls: ['./car-model-dialog.component.scss'],
})
export class CarModelDialogComponent {
  TAG = 'CarModelDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  carModel: CarModel = new CarModel();
  carModels: CarModel[] = [];
  filteredCarModels: CarModel[] = [];
  terminals: Terminal[] = [];
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  terminalId: string = '';

  constructor(
    private dialogRef: MatDialogRef<CarModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public carModelService: CarModelService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.carModel = data.carModel;
    this.carModels = data.carModels;
    this.terminals = data.terminals;
    this.brands = data.brands;
    console.log(`${this.TAG} > constructor > this.CarModel`, this.carModel);
    if (this.carModel.id) {
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
      terminalId: [
        {
          value: this.carModel.brand?.terminalId ?? null,
          disabled: false,
        },
        this.actionMode === ActionMode.update ? [] : [Validators.required],
      ],
      brandId: [
        {
          value: this.carModel.brandId ?? null,
          disabled: false,
        },
        this.actionMode === ActionMode.update ? [] : [Validators.required],
      ],
      mercedesModeloId: [
        {
          value: this.carModel.mercedesModeloId ?? null,
          disabled: this.actionMode === ActionMode.update ? true : false,
        },
        [Validators.required, Validators.maxLength(3)],
      ],
      name: [
        {
          value: this.carModel.name ?? null,
          disabled: false,
        },
        [],
      ],
      description: [
        {
          value: this.carModel.description ?? null,
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

  searchComparisonFn = (searchTerm: string, option: { codName: string }): boolean => { 
    return option.codName.toLowerCase().includes(searchTerm.toLowerCase());
  };

  save() {
    this.loading = true;
    this.accept = '';
    const rawValue = this.formGroup.getRawValue();
    console.log(`${this.TAG} > save > rawValue`, rawValue);
    const terminal = this.terminals.find((t) => t.id == rawValue.terminalId);
    const brand = this.brands.find((b) => b.id == rawValue.brandId);
    const createDto: CarModelCreateUpdateDto = {
      id: this.carModel.id ?? uuidv4(),
      brandId: rawValue.brandId ?? '00000000-0000-0000-0000-000000000033',
      mercedesTerminalId: terminal?.mercedesTerminalId,
      mercedesMarcaId: brand?.mercedesMarcaId,
      mercedesModeloId: rawValue.mercedesModeloId,
      name: rawValue.description,
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

  create(createDto: CarModelCreateUpdateDto): void {
    this.carModelService.create(createDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Modelo guardada con éxito!',
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

  update(updateDto: CarModelCreateUpdateDto): void {
    this.carModelService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Modelo actualizado con éxito!',
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

  filterBrands(event: NgxMatSelectionChangeEvent) {
    this.filteredBrands = [];
    this.terminalId = event.value as string;
    const terminal = this.terminals.find((t) => event.value == t.id);
    this.filteredBrands = this.brands.filter(
      (b) => terminal?.mercedesTerminalId == b.mercedesTerminalId
    );
    this.formGroup.get('brandId')?.setValue(null);
    this.formGroup.get('mercedesModeloId')?.setValue(null);
  }

  filterCarModels(event: NgxMatSelectionChangeEvent) {
    this.filteredCarModels = [];
    const brand = this.brands.find((b) => event.value == b.id);
    this.filteredCarModels = this.carModels.filter(
      (cm) => brand?.mercedesMarcaId == cm.mercedesMarcaId
    );
  }
}

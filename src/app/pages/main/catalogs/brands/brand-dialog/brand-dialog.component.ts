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
import { BrandCreateUpdateDto } from 'src/app/models/brands/brand-create-update.dto';
import { Brand } from 'src/app/models/brands/brand.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { BrandService } from 'src/app/services/brands/brand.service';
import { v4 as uuidv4 } from 'uuid';
export interface DialogData {
  brand: Brand;
  brandId: string;
  brands: Brand[];
  terminals: Terminal[];
}
@Component({
  selector: 'app-brand-dialog',
  templateUrl: './brand-dialog.component.html',
  styleUrls: ['./brand-dialog.component.scss'],
})
export class BrandDialogComponent {
  TAG = 'BrandDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  isLoading = false;
  terminals: Terminal[] = [];
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  brand: Brand = new Brand();
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];

  constructor(
    private dialogRef: MatDialogRef<BrandDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public brandService: BrandService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.brand = data.brand;
    this.brands = data.brands;
    this.terminals = data.terminals;
    console.log(`${this.TAG} > constructor > this.brand`, this.brand);
    if (this.brand.id) {
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
          value: this.brand.terminalId ?? null,
          disabled: false,
        },
        this.actionMode === ActionMode.update ? [] : [Validators.required],
      ],
      mercedesMarcaId: [
        {
          value: this.brand.mercedesMarcaId ?? null,
          disabled: this.actionMode === ActionMode.update ? true : false,
        },
        [Validators.required, Validators.maxLength(3)],
      ],
      name: [
        {
          value: this.brand.name ?? null,
          disabled: false,
        },
        [],
      ],
      description: [
        {
          value: this.brand.description ?? null,
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
    const createDto: BrandCreateUpdateDto = {
      id: this.brand.id ?? uuidv4(),
      terminalId: rawValue.terminalId ?? '00000000-0000-0000-0000-000000000033',
      mercedesTerminalId: terminal?.mercedesTerminalId,
      mercedesMarcaId: rawValue.mercedesMarcaId,
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

  create(createDto: BrandCreateUpdateDto): void {
    this.brandService.create(createDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: 'Marca guardada con éxito!',
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

  update(updateDto: BrandCreateUpdateDto): void {
    this.brandService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Marca actualizada con éxito!',
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
    const terminal = this.terminals.find((t) => event.value == t.id);
    this.filteredBrands = this.brands.filter(
      (b) => terminal?.mercedesTerminalId == b.mercedesTerminalId
    );
  }
}

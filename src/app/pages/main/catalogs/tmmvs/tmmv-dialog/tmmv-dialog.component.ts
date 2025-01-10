import { BreakpointObserver, Breakpoints, BreakpointState, } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, } from '@angular/material/dialog';
import { NgxMatSelectionChangeEvent } from 'ngx-mat-select';
import { Subject } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Brand } from 'src/app/models/brands/brand.model';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { InternalVersion } from 'src/app/models/internal-versions/internal-version.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { TmmvCreateUpdateDto } from 'src/app/models/tmmvs/tmmv-create-update.dto';
import { Tmmv } from 'src/app/models/tmmvs/tmmv.model';
import { TmmvService } from 'src/app/services/tmmvs/tmmv.service';
import { v4 as uuidv4, v4 } from 'uuid';
import { InternalVersionDialogComponent } from '../../internal-versions/internal-version-dialog/internal-version-dialog.component';
import { PatentingVersion } from 'src/app/models/patenting-versions/patenting-version.model';
import { WholesaleVersion } from 'src/app/models/wholesale-versions/wholesale-version.model';
import { PatentingVersionDialogComponent } from '../../patenting-versions/patenting-version-dialog/patenting-version-dialog.component';
import { WholesaleVersionsDialogComponent } from '../../wholesale-versions/wholesale-versions-dialog/wholesale-versions-dialog.component';
import { CatInternalVersion } from 'src/app/models/cat-internal-versions/cat-internal-versions.model';

export interface DialogData {
  tmmv: Tmmv;
  tmmvId: string;
  brands: Brand[];
  terminals: Terminal[];
  carModels: CarModel[];
  patentingVersions: PatentingVersion[];
  wholesaleVersions: WholesaleVersion[];
  catInternalVersions: CatInternalVersion[];
}
@Component({
  selector: 'app-tmmv-dialog',
  templateUrl: './tmmv-dialog.component.html',
  styleUrls: ['./tmmv-dialog.component.scss'],
})

export class TmmvDialogComponent {
  TAG = 'TmmvDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  tmmv: Tmmv = new Tmmv();
  isLoading = false;
  terminals: Terminal[] = [];
  terminalId: string = '';
  brands: Brand[] = [];
  brandId: string = '';
  filteredBrands: Brand[] = [];
  carModels: CarModel[] = [];
  carModel: CarModel = new CarModel();
  carModelId: string = '';
  filteredCarModels: CarModel[] = [];
  patentingVersion: PatentingVersion = new PatentingVersion();
  wholesaleVersion: WholesaleVersion = new WholesaleVersion();
  catInternalVersion: CatInternalVersion = new CatInternalVersion();
  patentingVersions: PatentingVersion[] = [];
  wholesaleVersions: WholesaleVersion[] = [];
  catInternalVersions: CatInternalVersion[] = [];
  filteredPatentingVersions: PatentingVersion[] = [];
  filteredWholesaleVersions: WholesaleVersion[] = [];
  filteredCatInternalVersions: CatInternalVersion[] = [];
  brandSelected: Brand = new Brand();
  terminalSelected: Terminal = new Terminal();
  carModelSelected: CarModel = new CarModel();
  patentingVersionSelected: PatentingVersion = new PatentingVersion();
  wholesaleVersionSelected: WholesaleVersion = new WholesaleVersion();
  catInternalVersionSelected: CatInternalVersion = new CatInternalVersion();

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<TmmvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public tmmvService: TmmvService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.tmmv = data.tmmv;
    this.terminals = data.terminals;
    this.brands = data.brands;
    this.filteredBrands = data.tmmv.id ? data.brands : [];
    this.carModels = data.carModels;
    this.filteredCarModels = data.tmmv.id ? data.carModels : [];
    this.patentingVersions = data.patentingVersions;
    this.wholesaleVersions = data.wholesaleVersions;
    this.catInternalVersions = data.catInternalVersions;
    console.log(`${this.TAG} > constructor > this.tmmv`, this.tmmv);
    console.log(`${this.TAG} > constructor > this.brands`, this.brands);
    console.log(`${this.TAG} > constructor > this.terminals`, this.terminals);
    console.log(`${this.TAG} > constructor > this.carModels`, this.carModels);
    console.log(`${this.TAG} > constructor > this.patentingVersions`, this.patentingVersions);
    console.log(`${this.TAG} > constructor > this.wholesaleVersions`, this.wholesaleVersions);
    console.log(`${this.TAG} > constructor > this.catInternalVersions`, this.catInternalVersions);
    if (data.tmmv.carModelId) {
      this.tmmv = data.tmmv
      this.carModel = data.carModels.find((cm) => cm.id === this.tmmv.carModelId)!;
      this.patentingVersion = data.patentingVersions.find((pv) =>
        pv.version === this.tmmv.versionPatentamiento
        && pv.carModelId === this.carModel.id)!;
      if (!this.patentingVersion) this.patentingVersion = new PatentingVersion();


      this.wholesaleVersion = data.wholesaleVersions.find((wv) =>
        wv.version === this.tmmv.versionWs
        && wv.carModelId === this.carModel.id)!;
      if (!this.wholesaleVersion) this.wholesaleVersion = new WholesaleVersion();

      this.catInternalVersion = data.catInternalVersions.find((iv) =>
        iv.version === this.tmmv.versionInterna
        && iv.carModelId === this.carModel.id)!;
      if (!this.catInternalVersion) this.catInternalVersion = new CatInternalVersion();
    }

    if (this.tmmv.id) {
      this.actionMode = ActionMode.update;
      this.formGroup = this.createFormGroup();
      this.filterTMM();
      this.disableTMM();
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
      versionPatentamiento: [
        {
          value: this.patentingVersion.id ?? null,
          disabled: true,
        },
        [Validators.required],
      ],
      versionWs: [
        {
          value: this.wholesaleVersion.id ?? null,
          disabled: true,
        },
        [Validators.required],
      ],
      versionInterna: [
        {
          value: this.catInternalVersion.id ?? null,
          disabled: true,
        },
        [Validators.required],
      ],
      terminalId: [
        {
          value: this.carModel ? this.carModel.brand?.terminalId : null,
          disabled: false,
        },
        [],
      ],
      marcaId: [
        {
          value: this.carModel ? this.carModel.brandId : null,
          disabled: true,
        },
        [],
      ],
      carModelId: [
        {
          value: this.carModel ? this.carModel.id : null,
          disabled: true,
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
    // const onlyValues = Object.values(option)
    // const jsonOption = JSON.stringify(onlyValues)
    return option.codName.toLowerCase().includes(searchTerm.toLowerCase());
  };

  save() {
    this.loading = true;
    this.accept = '';
    const rawValue = this.formGroup.getRawValue();
    console.log(`${this.TAG} > save > rawValue`, rawValue);
    const terminal = this.terminals.find((t) => t.id == rawValue.terminalId);
    const brand = this.brands.find((b) => b.id == rawValue.marcaId);
    const carModel = this.carModels.find((cm) => cm.id == rawValue.carModelId);
    const internalVersion = this.catInternalVersions.find(
      (iv) => iv.id == rawValue.versionInterna
    );
    let patVersion = this.patentingVersions.find(
      (iv) => iv.id == rawValue.versionPatentamiento
    );
    const wsVersion = this.wholesaleVersions.find(
      (iv) => iv.id == rawValue.versionWs
    );
    const createDto: TmmvCreateUpdateDto = {
      id: this.tmmv.id ?? uuidv4(),
      versionPatentamiento: patVersion?.version ? patVersion?.version : "",
      descripcionVerPat: patVersion?.description,
      versionWs: wsVersion?.version ?  wsVersion?.version : "",
      descripcionVerWs: wsVersion?.description,
      versionInterna: internalVersion?.version,
      descripcionVerInt: internalVersion?.description,
      carModelId: carModel?.id!,
      mercedesTerminalId: terminal?.mercedesTerminalId,
      descripcionTerminal: terminal?.description,
      mercedesMarcaId: brand?.mercedesMarcaId,
      descripcionMarca: brand?.description,
      mercedesModeloId: carModel?.mercedesModeloId,
      descripcionModelo: carModel?.description,
    };
    console.log('createDto', createDto);
    if (this.actionMode === ActionMode.create) {
      this.create(createDto);
    }
    if (this.actionMode === ActionMode.update) {
      this.update(createDto);
    }
  }

  create(createDto: TmmvCreateUpdateDto): void {
    this.tmmvService.create(createDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡TMMV guardada con éxito!',
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

  update(updateDto: TmmvCreateUpdateDto): void {
    this.tmmvService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡TMMV actualizada con éxito!',
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

  disableTMM() {
    this.formGroup.get('terminalId')?.disable();
    this.formGroup.get('marcaId')?.disable();
    this.formGroup.get('carModelId')?.disable();
    this.formGroup.get('versionInterna')?.enable();
    this.formGroup.get('versionPatentamiento')?.enable();
    this.formGroup.get('versionWs')?.enable();
  }

  filterBrands(event: NgxMatSelectionChangeEvent) {
    this.filteredBrands = [];
    this.terminalId = event.value as string;
    const terminal = this.terminals.find((t) => event.value == t.id);
    this.filteredBrands = this.brands.filter(
      (b) => terminal?.id == b.terminalId
    );
    this.formGroup.get('marcaId')?.setValue(null);
    this.formGroup.get('carModelId')?.setValue(null);
    this.formGroup.get('versionInterna')?.setValue(null);
    this.formGroup.get('versionPatentamiento')?.setValue(null);
    this.formGroup.get('versionWs')?.setValue(null);
    this.formGroup.get('carModelId')?.disable();
    this.formGroup.get('versionInterna')?.disable();
    this.formGroup.get('versionPatentamiento')?.disable();
    this.formGroup.get('versionWs')?.disable();
    this.filteredCarModels = [];
    this.filteredCatInternalVersions = [];
    this.filteredPatentingVersions = [];
    this.filteredWholesaleVersions = [];
    this.terminalSelected = terminal!;
    this.formGroup.get('marcaId')?.enable();

  }

  filterModels(event: NgxMatSelectionChangeEvent) {
    this.filteredCarModels = [];
    this.brandId = event.value as string;
    const brand = this.brands.find((b) => event.value == b.id);
    this.filteredCarModels = this.carModels.filter(
      (cm) => brand?.id == cm.brandId
    );
    this.formGroup.get('carModelId')?.setValue(null);
    this.formGroup.get('versionInterna')?.setValue(null);
    this.formGroup.get('versionPatentamiento')?.setValue(null);
    this.formGroup.get('versionWs')?.setValue(null);
    this.formGroup.get('versionInterna')?.disable();
    this.formGroup.get('versionPatentamiento')?.disable();
    this.formGroup.get('versionWs')?.disable();
    this.filteredCatInternalVersions = [];
    this.filteredPatentingVersions = [];
    this.filteredWholesaleVersions = [];
    this.brandSelected = brand!;
    this.formGroup.get('carModelId')?.enable();
  }

  filterVersions(event: NgxMatSelectionChangeEvent) {
    this.carModelSelected = this.carModels.find((iv) => event.value == iv.id)!;
    this.wholesaleVersionSelected = new WholesaleVersion();
    this.patentingVersionSelected = new PatentingVersion();
    this.catInternalVersionSelected = new CatInternalVersion();
    this.filterPatentingVersions();
    this.filterWholesaleVersions();
    this.filterInternalVersions();
    this.formGroup.get('versionInterna')?.enable();
    this.formGroup.get('versionWs')?.enable();
    this.formGroup.get('versionPatentamiento')?.enable();
  }

  filterPatentingVersions() {
    this.filteredPatentingVersions = [];
    const carModel = this.carModelSelected;
    this.filteredPatentingVersions = this.patentingVersions.filter(
      (iv) =>
        carModel?.mercedesModeloId == iv.mercedesModeloId &&
        carModel?.mercedesMarcaId == iv.mercedesMarcaId &&
        carModel?.mercedesTerminalId == iv.mercedesTerminalId
    );
  }

  filterWholesaleVersions() {
    this.filteredWholesaleVersions = [];
    const carModel = this.carModelSelected;
    this.filteredWholesaleVersions = this.wholesaleVersions.filter(
      (iv) =>
        carModel?.mercedesModeloId == iv.mercedesModeloId &&
        carModel?.mercedesMarcaId == iv.mercedesMarcaId &&
        carModel?.mercedesTerminalId == iv.mercedesTerminalId
    );
  }

  filterInternalVersions() {
    this.filteredCatInternalVersions = [];
    const carModel = this.carModelSelected;
    this.filteredCatInternalVersions = this.catInternalVersions.filter(
      (iv) =>
        carModel?.mercedesModeloId == iv.mercedesModeloId &&
        carModel?.mercedesMarcaId == iv.mercedesMarcaId &&
        carModel?.mercedesTerminalId == iv.mercedesTerminalId && 
        iv.dateTo && (new Date(iv.dateTo) > new Date())
    );
    
  }  

  filterTMM() {
    const carModel = this.carModel;
    this.filteredPatentingVersions = [];
    this.filteredWholesaleVersions = [];
    this.filteredCatInternalVersions = [];
    this.patentingVersionSelected = this.patentingVersion!;
    this.wholesaleVersionSelected = this.wholesaleVersion!;
    this.catInternalVersionSelected = this.catInternalVersion!;
    this.filteredPatentingVersions = this.patentingVersions.filter((pv) => carModel?.id == pv.carModelId);
    this.filteredWholesaleVersions = this.wholesaleVersions.filter((wv) => carModel?.id == wv.carModelId);
    this.filteredCatInternalVersions = this.catInternalVersions.filter((iv) => carModel?.id == iv.carModelId);
  }

  setPatentingVersion(event: NgxMatSelectionChangeEvent) {
    this.patentingVersionSelected = this.patentingVersions.find((iv) => event.value == iv.id)!;
  }

  setWholesaleVersion(event: NgxMatSelectionChangeEvent) {
    this.wholesaleVersionSelected = this.wholesaleVersions.find((wvs) => event.value == wvs.id)!;
  }

  setInternalVersion(event: NgxMatSelectionChangeEvent) {
    this.catInternalVersionSelected = this.catInternalVersions.find((iv) => event.value == iv.id)!;
  }

  createInternalVersion() {
    const carModel = this.carModels.find((t) => this.data.tmmv.carModelId == t.id);
    const dialogRef = this.dialog.open(InternalVersionDialogComponent, {
      width: this.isXsOrSm ? '90%' : '50%',
      height: this.isXsOrSm ? '90%' : '50%',
      disableClose: true,
      data: {
        catInternalVersion: v4(),
        terminals: this.terminals,
        brands: this.brands,
        carModels: this.carModels,
        carModel: carModel ?? this.carModelSelected,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        result.codName = `(${result.version}) ${result.description}`;
        this.catInternalVersions.push(result);
        this.filteredCatInternalVersions.push(result);
      }
    });
  }

  createPatentingVersion() {
    const carModel = this.carModels.find((t) => this.data.tmmv.carModelId == t.id);
    const dialogRef = this.dialog.open(PatentingVersionDialogComponent, {
      width: this.isXsOrSm ? '90%' : '60%',
      height: this.isXsOrSm ? '90%' : '45%',
      disableClose: true,
      data: {
        patentingVersion: v4(),
        terminals: this.terminals,
        brands: this.brands,
        carModels: this.carModels,
        carModel: carModel ?? this.carModelSelected,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        result.codName = `(${result.version}) ${result.description}`;
        this.patentingVersions.push(result);
        this.filteredPatentingVersions.push(result);
      }
    });
    this.formGroup.get('versionPatentamiento')?.enable();
  }

  createWholesaleVersion() {
    const carModel = this.carModels.find((t) => this.data.tmmv.carModelId == t.id);
    const dialogRef = this.dialog.open(WholesaleVersionsDialogComponent, {
      width: this.isXsOrSm ? '90%' : '60%',
      height: this.isXsOrSm ? '90%' : '45%',
      disableClose: true,
      data: {
        wholesaleVersion: v4(),
        terminals: this.terminals,
        brands: this.brands,
        carModels: this.carModels,
        carModel: carModel ?? this.carModelSelected,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        result.codName = `(${result.version}) ${result.description}`;
        this.wholesaleVersions.push(result);
        this.filteredWholesaleVersions.push(result);
      }
    });
  }
}

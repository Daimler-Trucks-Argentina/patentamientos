import { BreakpointObserver,  Breakpoints, BreakpointState,} from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 
import { NgxMatSelectionChangeEvent } from 'ngx-mat-select';
import { Subject } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Brand } from 'src/app/models/brands/brand.model';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { OfmmCreateUpdateDto } from 'src/app/models/ofmms/ofmm-create-update.dto';
import { Ofmm } from 'src/app/models/ofmms/ofmm.model';
import { PatentingVersion } from 'src/app/models/patenting-versions/patenting-version.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { OfmmService } from 'src/app/services/ofmms/ofmm.service';
import { TmmvService } from 'src/app/services/tmmvs/tmmv.service';
import { v4 as uuidv4 } from 'uuid';

export interface DialogData {
  ofmm: Ofmm;
  ofmmId: string;
  brands: Brand[];
  carModels: CarModel[];
  terminals: Terminal[];
  patentingVersions: PatentingVersion[];
  patentingData: any;
}

@Component({
  selector: 'app-ofmm-dialog',
  templateUrl: './ofmm-dialog.component.html',
  styleUrls: ['./ofmm-dialog.component.scss'],
})
export class OfmmDialogComponent implements OnInit {
  TAG = 'OfmmDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  ofmm: Ofmm = new Ofmm();
  isLoading = false;
  events: string[] = [];
  brands: Brand[] = [];
  patentingVersions: PatentingVersion[] = [];
  filteredPatentingVersions: PatentingVersion[] = [];
  filteredBrands: Brand[] = [];
  brandId: string = '';
  carModels: CarModel[] = [];
  carModel: CarModel = new CarModel();
  filteredCarModels: CarModel[] = []; 
  terminals: Terminal[] = [];
  terminalId: string = '';
  patentingData: any;
  loadingSelect = false;
  minDate = new Date(1000, 0, 1);
  patent: PatentingVersion = new PatentingVersion();

  constructor(
    private dialogRef: MatDialogRef<OfmmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public ofmmService: OfmmService,
    public tmmvService: TmmvService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.ofmm = data.ofmm;
    this.brands = data.brands;
    this.filteredBrands = data.ofmm.id || data.patentingData ? data.brands : [];
    this.terminals = data.terminals;
    this.carModels = data.carModels;
    this.patentingVersions = data.patentingVersions;
    this.filteredCarModels = data.ofmm.id || data.patentingData ? data.carModels : [];
    this.filteredPatentingVersions = data.ofmm.id || data.patentingData ? data.patentingVersions : [];
    this.patentingData = data.patentingData ?? null;
    console.log(`${this.TAG} > constructor > this.ofmm`, this.ofmm);
    console.log(`${this.TAG} > constructor > this.brands`, this.brands);
    console.log(`${this.TAG} > constructor > this.terminals`, this.terminals);
    console.log(`${this.TAG} > constructor > this.carModels`, this.carModels);
    console.log(`${this.TAG} > constructor > this.patentingData`,this.patentingData);
    console.log(`${this.TAG} > constructor > this.patentingVersions`, this.patentingVersions);
    if (data.patentingVersions){
      this.patent = this.data.patentingVersions.find((pv) => pv.version === this.data.ofmm.versionPatentamiento)!;
      console.log("patent: ", this.patent);
    }
    if (data.ofmm.modelo || data.patentingData) {
      const id = data.ofmm.carModelId ?? data.patentingData.carModelId;
      this.carModel = data.carModels.find((cm) => cm.id === id)!; 
      console.log('this.carModel', this.carModel);      
    }
   
    if (this.ofmm.id) {
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
    console.log(this.formGroup);
  }

  createFormGroup(): FormGroup {
    const validoDesdeStr = this.ofmm.validoDesde?.toString();
    const validoDesde = new Date(validoDesdeStr!);
    validoDesde.setHours(validoDesde.getHours() + 4);

    const validoHastaStr = this.ofmm.validoHasta?.toString();
    const validoHasta = new Date(validoHastaStr!);
    validoHasta.setHours(validoHasta.getHours() + 4);

    const formGroup = this.formBuilder.group({
      zofmm: [ { 
          value: this.ofmm.zofmm ? this.ofmm.zofmm : this.patentingData ? this.patentingData.ofmm : null,
          disabled: this.actionMode === ActionMode.update ? true : false,
        },
      ],
      validoDesde: [
        {
          value: isNaN(validoDesde.valueOf()) ? new Date('1000-01-01T06:00:00Z') : validoDesde,
          disabled: false,
        },
        [],
      ],
      validoHasta: [
        {
          value: isNaN(validoHasta.valueOf()) ? new Date('9999-12-31T06:00:00Z') : validoHasta,
          disabled: false,
        },
      ],
      fabricaPat: [
        {
          value: this.ofmm.fabricaPat ? this.ofmm.fabricaPat : this.patentingData ? this.patentingData.fabricaPat : null,
          disabled: this.actionMode === ActionMode.update ? true : false,
        },
        [],
      ],
      marcaPat: [
        {
          value: this.ofmm.marcaPat ? this.ofmm.marcaPat : this.patentingData ? this.patentingData.marcaPat : null,
          disabled: this.actionMode === ActionMode.update ? true : false,
        },
        [],
      ],
      modelopat: [
        {
          value: this.ofmm.modelopat ? this.ofmm.modelopat : this.patentingData ? this.patentingData.modeloPat : null,
          disabled: this.actionMode === ActionMode.update ? true : false,
        },
        [],
      ],
      descripcion1: [
        {
          value: this.ofmm.descripcion1 ? this.ofmm.descripcion1 : this.patentingData ? `${this.patentingData.fabrica_D} ${this.patentingData.marca_D}` : null,
          disabled: true,
        },
        [],
      ],
      descripcion2: [
        {
          value: this.ofmm.descripcion2 ? this.ofmm.descripcion2 : this.patentingData ? this.patentingData.modelo_D : null,
          disabled: true,
        },
        [],
      ],
      tipoDeTexto: [
        {
          value: this.ofmm.tipoDeTexto ? this.ofmm.tipoDeTexto : this.patentingData ? this.patentingData.tipo_D : null,
          disabled: true,
        },
        [],
      ],
      versionPatentamiento: [
        {
          value: this.patent? this.patent.id : null,//this.ofmm.versionPatentamiento ?? null,
          disabled: this.actionMode === ActionMode.update ? true : false,
        },
        [],
      ],
      terminalId: [
        {
          value: this.carModel ? this.carModel.brand?.terminalId : null,
          disabled: this.actionMode === ActionMode.update ? true : false,
        },
        [Validators.required],
      ],
      marcaId: [
        {
          value: this.carModel ? this.carModel.brandId : null,
          disabled: this.actionMode === ActionMode.update ? true : false,
        },
        [Validators.required],
      ],
      modeloId: [
        {
          value: this.carModel ? this.carModel.id : null,
          disabled: this.actionMode === ActionMode.update ? true : false,
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
    const terminal = this.terminals.find((t) => t.id == this.terminalId);
    const brand = this.brands.find((b) => b.id == this.brandId);
    const carModel = this.carModels.find((cm) => cm.id == rawValue.modeloId);
    const pat = this.patentingVersions.find((pv) => pv.id == rawValue.versionPatentamiento);
    const createDto: OfmmCreateUpdateDto = {
      id: this.ofmm.id ?? uuidv4(),
      zofmm: rawValue.zofmm,
      validoDesde: rawValue.validoDesde,
      validoHasta: rawValue.validoHasta,
      fabricaPat: rawValue.fabricaPat,
      marcaPat: rawValue.marcaPat,
      modelopat: rawValue.modelopat,
      descripcion1: rawValue.descripcion1,
      descripcion2: rawValue.descripcion2,
      tipoDeTexto: rawValue.tipoDeTexto,
      terminal: carModel?.mercedesTerminalId,
      marca: carModel?.mercedesMarcaId,
      modelo: carModel?.mercedesModeloId,
      versionPatentamiento: pat?.version,
      carModelId: rawValue.modeloId,
      factoryId: '00000000-0000-0000-0000-000000000033',
    };
    console.log('createDto', createDto);
    if (this.actionMode === ActionMode.create) {
      this.create(createDto);
    }
    if (this.actionMode === ActionMode.update) {
      this.update(createDto);
    }
  }

  create(createDto: OfmmCreateUpdateDto): void {
    this.ofmmService.create(createDto).subscribe({
      next: (response) => {
        this.patentingData
          ? (response!.isPatenting = true)
          : (response!.isPatenting = false);
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡OFMM guardada con éxito!',
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

  update(updateDto: OfmmCreateUpdateDto): void {
    this.ofmmService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡OFMM actualizada con éxito!',
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
    this.filteredCarModels = [];
    this.filteredPatentingVersions = [];
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
    this.filteredPatentingVersions = [];
    this.brandId = event.value as string;
    const brand = this.brands.find((b) => event.value == b.id);
    this.filteredCarModels = this.carModels.filter(
      (cm) => brand?.mercedesMarcaId == cm.mercedesMarcaId &&
      brand?.mercedesTerminalId == cm.mercedesTerminalId
    );
    this.formGroup.get('modeloId')?.setValue(null);
    this.formGroup.get('versionPatentamiento')?.setValue(null);
  }

  filterVerPats(event: NgxMatSelectionChangeEvent) {   
    this.filteredPatentingVersions = [];
    this.carModel = this.carModels.find((iv) => event!.value == iv.id)!;  
    this.filteredPatentingVersions = this.patentingVersions.filter(
      (iv) =>
        this.carModel?.mercedesModeloId == iv.mercedesModeloId &&
        this.carModel?.mercedesMarcaId == iv.mercedesMarcaId &&
        this.carModel?.mercedesTerminalId == iv.mercedesTerminalId
    );
  }

  fillVerPat(event: NgxMatSelectionChangeEvent) {
    this.formGroup.get('versionPatentamiento')?.setValue(event.value);
  }

  enableForm() {
    if (this.actionMode === ActionMode.update) {
      this.formGroup.enable();
      this.formGroup.get('zofmm')?.disable();
      this.formGroup.get('descripcion1')?.disable();
      this.formGroup.get('descripcion2')?.disable();
      this.formGroup.get('tipoDeTexto')?.disable();
    }
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }
}

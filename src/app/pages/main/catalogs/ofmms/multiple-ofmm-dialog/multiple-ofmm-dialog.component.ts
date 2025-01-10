import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxMatSelectionChangeEvent } from 'ngx-mat-select';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { Brand } from 'src/app/models/brands/brand.model';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { OfmmCreateUpdateDto } from 'src/app/models/ofmms/ofmm-create-update.dto';
import { PatentingVersion } from 'src/app/models/patenting-versions/patenting-version.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { OfmmService } from 'src/app/services/ofmms/ofmm.service';
import { v4 } from 'uuid';

export interface DialogData {
  ofmms: any;
  brands: Brand[];
  carModels: CarModel[];
  terminals: Terminal[];
  patentingVersions: PatentingVersion[];
}
@Component({
  selector: 'app-multiple-ofmm-dialog',
  templateUrl: './multiple-ofmm-dialog.component.html',
  styleUrls: ['./multiple-ofmm-dialog.component.scss'],
})
export class MultipleOfmmDialogComponent implements OnInit, AfterViewChecked {
  TAG = 'MultipleOfmmDialogComponent';
  displayedColumns = [
    'zofmm',
    'validoDesde',
    'validoHasta',
    'fabricaPat',
    'marcaPat',
    'modelopat',
    'descripcion1',
    'descripcion2',
    'tipoDeTexto',
    'terminalId',
    'marcaId',
    'modeloId',
    'versionPatentamiento',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();
  formGroup: FormGroup;
  loading = false;
  accept = 'Guardar';
  events: string[] = [];
  ofmms = [];
  brands: Brand[] = [];
  // filteredBrands: Brand[] = [];
  filteredBrands: { [key: number]: Brand[] } = {};
  brandId: string = '';
  carModels: CarModel[] = [];
  carModel: CarModel = new CarModel();
  // filteredCarModels: CarModel[] = [];
  filteredCarModels: { [key: number]: CarModel[] } = {};
  terminals: Terminal[] = [];
  terminalId: string = '';
  patentingVersions: PatentingVersion[] = [];
  // filteredPatentingVersions: PatentingVersion[] = [];
  filteredPatentingVersions: { [key: number]: PatentingVersion[] } = {};
  minDate = new Date(1990, 0, 1);

  constructor(
    private dialogRef: MatDialogRef<MultipleOfmmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private sweetAlert: SweetAlert2Helper,
    private ofmmService: OfmmService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.ofmms = data.ofmms;
    this.brands = data.brands;
    this.terminals = data.terminals;
    this.carModels = data.carModels;
    this.patentingVersions = data.patentingVersions;
    // console.log(`${this.TAG} > constructor > this.ofmms`, this.ofmms);
    // console.log(`${this.TAG} > constructor > this.brands`, this.brands);
    // console.log(`${this.TAG} > constructor > this.terminals`, this.terminals);
    // console.log(`${this.TAG} > constructor > this.carModels`, this.carModels);
    this.formGroup = this.setOfmmsFormArray();
    this.ofmms.forEach((o) => {
      this.addOfmm(o);
    });
  }

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  get ofmmForm() {
    return this.formGroup.controls['ofmmForm'] as FormArray;
  }

  setOfmmsFormArray() {
    const formGroup = this.formBuilder.group({
      zofmm: new FormControl(''),
      validoDesde: new FormControl(new Date('1000-01-01T06:00:00Z')),
      validoHasta: new FormControl(new Date('9999-12-31T06:00:00Z')),
      fabricaPat: new FormControl(''),
      marcaPat: new FormControl(''),
      modelopat: new FormControl(''),
      descripcion1: new FormControl(''),
      descripcion2: new FormControl(''),
      tipoDeTexto: new FormControl(''),
      mercedesTerminalId: new FormControl(''),
      mercedesMarcaId: new FormControl(''),
      mercedesModeloId: new FormControl(''),
      versionPatentamiento: new FormControl(''),
      ofmmForm: this.formBuilder.array([]),
    });
    return formGroup;
  }

  addOfmm(ofmm?: any): void {
    const ofmmForm = this.formBuilder.group({
      zofmm: [ofmm.ofmm ?? ''],
      validoDesde: [new Date('1000-01-01T06:00:00Z')],
      validoHasta: [new Date('9999-12-31T06:00:00Z')],
      fabricaPat: [ofmm.fabricaPat ?? ''],
      marcaPat: [ofmm.marcaPat ?? ''],
      modelopat: [ofmm.modeloPat ?? ''],
      descripcion1: [`${ofmm.fabrica_D ?? ''} ${ofmm.marca_D ?? ''}`],
      descripcion2: [ofmm.modelo_D ?? ''],
      tipoDeTexto: [ofmm.tipo_D ?? ''],
      versionPatentamiento: [''],
      terminalId: [ofmm.carModel.brand.terminal.id ?? ''],
      marcaId: [ofmm.carModel.brand.id ?? ''],
      modeloId: [ofmm.carModel.id ?? ''],
    });

    this.ofmmForm.push(ofmmForm);
    this.dataSource = new MatTableDataSource(this.ofmmForm.controls);
  }

  deleteRow(i: number) {
    this.ofmmForm.removeAt(i);
    this.dataSource = new MatTableDataSource(this.ofmmForm.controls);
    // console.log('i', i);
  }

  save() {
    this.loading = true;
    this.accept = '';
    const formArray: any[] = [];
    this.ofmmForm.value.forEach((o: any) => {
      const carModel = this.carModels.find((cm) => cm.id == o.modeloId);
      const pat = this.patentingVersions.find(
        (pv) => pv.id == o.versionPatentamiento
      );
      const createDto: OfmmCreateUpdateDto = {
        id: v4(),
        zofmm: o.zofmm,
        validoDesde: o.validoDesde,
        validoHasta: o.validoHasta,
        fabricaPat: o.fabricaPat,
        marcaPat: o.marcaPat,
        modelopat: o.modelopat,
        descripcion1: o.descripcion1,
        descripcion2: o.descripcion2,
        tipoDeTexto: o.tipoDeTexto,
        terminal: carModel?.mercedesTerminalId,
        marca: carModel?.mercedesMarcaId,
        modelo: carModel?.mercedesModeloId,
        versionPatentamiento: pat?.version,
        carModelId: o.modeloId,
        factoryId: '00000000-0000-0000-0000-000000000033',
      };
      formArray.push(createDto);
    });
    // console.log('formArray', formArray);
    this.ofmmService.createMultipleOfmms(formArray).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡OFMMs guardadas con éxito!',
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

  searchComparisonFn = (
    searchTerm: string,
    option: { codName: string }
  ): boolean => {
    return option.codName.toLowerCase().includes(searchTerm.toLowerCase());
  };

  filterBrands(event: NgxMatSelectionChangeEvent, index: number) {
    this.filteredBrands[index] = [];
    this.terminalId = event.value as string;
    const terminal = this.terminals.find((t) => event.value == t.id);
    this.filteredBrands[index] = this.brands.filter(
      (b) => terminal?.mercedesTerminalId == b.mercedesTerminalId
    );
    this.formGroup.get(['ofmmForm', index, 'marcaId'])?.setValue(null);
    this.formGroup.get(['ofmmForm', index, 'modeloId'])?.setValue(null);
    this.formGroup
      .get(['ofmmForm', index, 'versionPatentamiento'])
      ?.setValue(null);
  }

  filterModels(event: NgxMatSelectionChangeEvent, index: number) {
    this.filteredCarModels[index] = [];
    this.brandId = event.value as string;
    const brand = this.brands.find((b) => event.value == b.id);
    this.filteredCarModels[index] = this.carModels.filter(
      (cm) => brand?.mercedesMarcaId == cm.mercedesMarcaId
    );
    this.formGroup.get(['ofmmForm', index, 'modeloId'])?.setValue(null);
    this.formGroup
      .get(['ofmmForm', index, 'versionPatentamiento'])
      ?.setValue(null);
  }

  filterVerPats(event: NgxMatSelectionChangeEvent, index: number) {
    this.filteredPatentingVersions[index] = [];
    this.carModel = this.carModels.find((iv) => event!.value == iv.id)!;
    this.filteredPatentingVersions[index] = this.patentingVersions.filter(
      (iv) =>
        this.carModel?.mercedesModeloId == iv.mercedesModeloId &&
        this.carModel?.mercedesMarcaId == iv.mercedesMarcaId &&
        this.carModel?.mercedesTerminalId == iv.mercedesTerminalId
    );
  }

  fillVerPat(event: NgxMatSelectionChangeEvent, index: number) {
    this.formGroup
      .get(['ofmmForm', index, 'versionPatentamiento'])
      ?.setValue(event.value);
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }
}

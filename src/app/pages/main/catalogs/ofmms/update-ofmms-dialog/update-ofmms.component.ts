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
  selector: 'app-update-ofmms-dialog',
  templateUrl: './update-ofmms-dialog.component.html',
  styleUrls: ['./update-ofmms-dialog.component.scss'],
})
export class UpdateOfmmsDialogComponent implements OnInit, AfterViewChecked {
  TAG = 'UpdateOfmmsDialogComponent';
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
    // 'acciones',
  ];
  dataSource = new MatTableDataSource<any>();
  formGroup: FormGroup;
  loading = false;
  accept = 'Guardar';
  events: string[] = [];
  ofmms: any[] = [];
  brands: Brand[] = [];
  filteredBrands: { [key: number]: Brand[] } = {};
  brandId: string = '';
  carModels: CarModel[] = [];
  carModel: CarModel = new CarModel();
  filteredCarModels: { [key: number]: CarModel[] } = {};
  terminals: Terminal[] = [];
  terminalId: string = '';
  patentingVersions: PatentingVersion[] = [];
  filteredPatentingVersions: { [key: number]: PatentingVersion[] } = {};
  minDate = new Date(1990, 0, 1);
  ofmmCode = '';

  constructor(
    private dialogRef: MatDialogRef<UpdateOfmmsDialogComponent>,
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
    this.ofmmCode = data.ofmms[0].zofmm;
    console.log(`${this.TAG} > constructor > this.ofmms`, this.ofmms);
    console.log(`${this.TAG} > constructor > this.brands`, this.brands);
    console.log(`${this.TAG} > constructor > this.terminals`, this.terminals);
    console.log(`${this.TAG} > constructor > this.carModels`, this.carModels);
    this.formGroup = this.setOfmmsFormArray();
    this.ofmms.forEach((ofmm, index) => {
      this.addOfmm(index, ofmm);
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
      id: new FormControl(''),
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

  addOfmm(index: number, ofmm?: any, addRow?: boolean): void {
    const versionPat = this.patentingVersions.find(
      (pv) =>
        pv.mercedesTerminalId === ofmm.terminal &&
        pv.mercedesMarcaId === ofmm.marca &&
        pv.mercedesModeloId === ofmm.modelo &&
        pv.version === ofmm.versionPatentamiento
    );

    const ofmmForm = this.formBuilder.group({
      id: [ofmm.id ?? ''],
      zofmm: [ofmm.zofmm ?? ''],
      validoDesde: [ofmm.validoDesde ?? new Date('1000-01-01T06:00:00Z')],
      validoHasta: [
        addRow
          ? new Date('9999-12-31T06:00:00Z')
          : ofmm.validoHasta ?? new Date('9999-12-31T06:00:00Z'),
      ],
      fabricaPat: [ofmm.fabricaPat ?? ''],
      marcaPat: [ofmm.marcaPat ?? ''],
      modelopat: [ofmm.modelopat ?? ''],
      descripcion1: [ofmm.descripcion1 ?? ''],
      descripcion2: [ofmm.descripcion2 ?? ''],
      tipoDeTexto: [ofmm.tipoDeTexto ?? ''],
      versionPatentamiento: [versionPat?.id ?? ''],
      terminalId: [ofmm.carModel.brand.terminal.id ?? ''],
      marcaId: [ofmm.carModel.brand.id ?? ''],
      modeloId: [ofmm.carModel.id ?? ''],
    });

    this.filteredBrands[index] = this.brands.filter(
      (b) => b.mercedesTerminalId === ofmm.terminal
    );

    this.filteredCarModels[index] = this.carModels.filter(
      (c) =>
        c.mercedesTerminalId === ofmm.terminal &&
        c.mercedesMarcaId === ofmm.marca
    );

    this.filteredPatentingVersions[index] = this.patentingVersions.filter(
      (c) =>
        c.mercedesTerminalId === ofmm.terminal &&
        c.mercedesMarcaId === ofmm.marca &&
        c.mercedesModeloId === ofmm.modelo
    );

    this.formGroup
      .get(['ofmmForm', index, 'terminalId'])
      ?.setValue(ofmm.carModel.brand.terminal.id);

    this.formGroup
      .get(['ofmmForm', index, 'marcaId'])
      ?.setValue(ofmm.carModel.brand.id);

    this.formGroup
      .get(['ofmmForm', index, 'modeloId'])
      ?.setValue(ofmm.carModel.id);

    this.formGroup
      .get(['ofmmForm', index, 'versionPatentamiento'])
      ?.setValue(versionPat?.id);

    this.ofmmForm.push(ofmmForm);
    this.dataSource = new MatTableDataSource(this.ofmmForm.controls);
  }

  addRow() {
    const newOfmm = this.ofmms[0];
    newOfmm.id = v4();
    this.formGroup.get(['ofmmForm', 0, 'validoHasta'])?.setValue(new Date());
    this.addOfmm(this.ofmmForm.length, this.ofmms[0], true);
  }

  deleteRow(i: number) {
    this.ofmmForm.removeAt(i);
    this.dataSource = new MatTableDataSource(this.ofmmForm.controls);
    console.log('i', i);
  }

  save() {
    this.loading = true;
    this.accept = '';
    const formArray: any[] = [];
    this.ofmmForm.value.forEach((o: any) => {
      const carModel = this.carModels.find((cm) => cm.id == o.modeloId);
      const ofmm = this.ofmms.find((a) => a.id === o.id);
      const pat = this.patentingVersions.find(
        (pv) => pv.id == o.versionPatentamiento
      );
      const createDto: OfmmCreateUpdateDto = {
        id: o.id ?? v4(),
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
    console.log('formArray', formArray);
    this.saveOfmm(formArray);
  }

  saveOfmm(formArray: any) {
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

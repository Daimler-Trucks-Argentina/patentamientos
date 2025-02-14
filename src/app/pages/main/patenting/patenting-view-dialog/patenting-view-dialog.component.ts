import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { PatentingService } from 'src/app/services/patentings/patenting.service';
import { PatentingComponent } from '../patenting.component';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BrandService } from 'src/app/services/brands/brand.service';
import { Brand } from 'src/app/models/brands/brand.model';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { CarModelService } from 'src/app/services/car-models/car-model.service';
import { Factory } from 'src/app/models/factories/factory.model';
import { FactoryService } from 'src/app/services/factories/factory.service';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { MatDatepicker } from '@angular/material/datepicker';
import { VehicleType } from 'src/app/models/vehicle-types/vehicle-type.model';
import { VehicleTypeService } from 'src/app/services/vehicle-types/vehicle-type.service';
import * as moment from 'moment';
import { OfmmDialogComponent } from '../../catalogs/ofmms/ofmm-dialog/ofmm-dialog.component';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { BreakpointObserver, BreakpointState, Breakpoints, } from '@angular/cdk/layout';
import { v4 } from 'uuid';
import { PatentingVersion } from 'src/app/models/patenting-versions/patenting-version.model';
import { PatentingVersionService } from 'src/app/services/patenting-versions/patenting-version.service';

export interface DialogData {
  patentingId: any;
}
@Component({
  selector: 'app-patenting-view-dialog',
  templateUrl: './patenting-view-dialog.component.html',
  styleUrls: ['./patenting-view-dialog.component.scss'],
})
export class PatentingViewDialogComponent implements OnInit {
  @ViewChild('registerDate', { static: true }) registerDate:
    | MatDatepicker<Date>
    | undefined;
  TAG = PatentingComponent.name;
  private unsubscribeAll: Subject<any>;
  patentingId: string;
  dataError: any[] = [];
  patentingData: any;
  isLoading = false;
  isXsOrSm = false;
  formGroup: FormGroup;
  brands: Brand[] = [];
  carModels: CarModel[] = [];
  patentingVersions: PatentingVersion[] = [];
  factories: Factory[] = [];
  vehicleTypes: VehicleType[] = [];
  terminals: Terminal[] = [];
  groupedDataError: { codigo: string; regla: string; count: number }[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PatentingViewDialogComponent>,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private _patentingService: PatentingService,
    private brandService: BrandService,
    private carModelService: CarModelService,
    private factoryService: FactoryService,
    private vehicleTypeService: VehicleTypeService,
    private terminalService: TerminalService,
    private patentingVersionService: PatentingVersionService,
    private sweetAlert: SweetAlert2Helper,
    private formBuilder: FormBuilder
  ) {
    this.unsubscribeAll = new Subject();
    this.formGroup = this.createFormGroup();
    this.patentingId = this.data.patentingId;
    this.getDataByPatentingId(this.patentingId);
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

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  getDataByPatentingId(patentingId: string): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this._patentingService.getRulesByPatentingId(patentingId),
      this._patentingService.getDataByPatentingId(patentingId),
      this.brandService.getAll(),
      this.carModelService.getAll(),
      this.factoryService.getAll(),
      this.vehicleTypeService.getAll(),
      this.terminalService.getAll(),
      this.patentingVersionService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([
        rules,
        patentingData,
        brands,
        carModels,
        factories,
        vehicleTypes,
        terminals,
        patentingVersions
      ]) => {
        console.log(`${this.TAG} > getData > rules`, rules);
        console.log('PatentingId', patentingData);
        this.dataError = rules ?? [];

        // Agrupar y contar errores
        const errorMap: { [key: string]: { regla: string; count: number } } = {};
        this.dataError.forEach((error) => {
            if (!errorMap[error.codigo]) {
                errorMap[error.codigo] = { regla: error.regla, count: 0 };
            }
            errorMap[error.codigo].count++;
        });
    
        // Convertir el mapa en un array para usarlo en la plantilla
        this.groupedDataError = Object.entries(errorMap).map(([codigo, { regla, count }]) => ({
            codigo,
            regla,
            count,
        }));
        this.patentingData = patentingData;
        brands.forEach((b) => {
          b.codName = `(${b.mercedesMarcaId}) ${b.name}`;
        });
        this.brands = brands;
        carModels.forEach((cm) => {
          cm.codName = `(${cm.mercedesModeloId}) ${cm.name}`;
        });
        this.carModels = carModels;
        terminals.forEach((t) => {
          t.codName = `(${t.mercedesTerminalId}) ${t.name}`;
        });
        this.terminals = terminals;
        console.log( `${this.TAG} > getData > patentingVersions`, patentingVersions );
        const patVer: PatentingVersion[] = [];
        patentingVersions.forEach((pv) => {
          if (pv.version && pv.description) {
            pv.codName = `(${pv.version}) ${pv.description}`;
            patVer.push(pv);
          }
        });
        this.patentingVersions = patVer;
        this.factories = factories;
        this.vehicleTypes = vehicleTypes;
        if (patentingData) {
          this.formGroup = this.createFormGroup();
          console.log('FG', this.formGroup);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`Patentings > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      brand: [
        {
          value: this.patentingData?.carModel.brand.id ?? null,
          disabled: true,
        },
        [],
      ],
      model: [
        {
          value: this.patentingData?.carModel.id ?? null,
          disabled: true,
        },
        [],
      ],
      factory: [
        {
          value: this.patentingData?.factory.id ?? null,
          disabled: true,
        },
        [],
      ],
      ofmm: [
        {
          value: this.patentingData ? this.patentingData.ofmm : '',
          disabled: false,
        },
      ],
      plate: [
        {
          value: this.patentingData?.plate ?? null,
          disabled: false,
        },
        [],
      ],
      chasis: [
        {
          value: this.patentingData?.chasis ?? null,
          disabled: false,
        },
        [],
      ],
      registerDate: [
        {
          value: moment(this.patentingData?.fechInsc).format() ?? null,
          disabled: false,
        },
        [],
      ],
      registerDateDisplay: [
        {
          value: this.patentingData?.fechInsc
            ? moment(this.patentingData.fechInsc).format('DD/MM/YYYY')
            : null,
          disabled: false,
        },
        [],
      ],
      motor: [
        {
          value: this.patentingData?.motor ?? null,
          disabled: false,
        },
        [],
      ],
      vehicleType: [
        {
          value: this.patentingData?.vehicleType.id ?? null,
          disabled: false,
        },
        [],
      ],
    });
    return formGroup;
  }

  onRegisterDateBlur($event: any): void {
    console.log('Blur', $event);
    const formattedDate = this.formGroup.get(`registerDateDisplay`)?.value;
    if (!formattedDate) return;
    const registerDate = moment(formattedDate, 'DD/MM/YYYY');
    this.registerDate?.select(registerDate.toDate());
  }

  openRegisterDatePicker($event: any) {
    if (!$event) return;
    $event.preventDefault();
    $event.stopPropagation();
    this.registerDate?.open();
  }

  onRegisterDateChange($event: any): void {
    console.log('CHANGE', $event);
    const formattedDate = moment($event.value).format('DD/MM/YYYY');
    this.formGroup.get(`registerDateDisplay`)?.setValue(formattedDate);
  }

  save() {
    this.isLoading = true;
    const rawValue = this.formGroup.getRawValue();
    console.log('ra', rawValue);
    this.patentingData.brandId = rawValue.brand;
    this.patentingData.factoryId = rawValue.factory;
    this.patentingData.carModelId = rawValue.model;
    this.patentingData.plate = rawValue.plate;
    this.patentingData.ofmm = rawValue.ofmm;
    this.patentingData.chasis = rawValue.chasis;
    this.patentingData.motor = rawValue.motor;
    this.patentingData.fechInsc = rawValue.registerDate;
    this.patentingData.vehicleTypeId = rawValue.vehicleType;
    this._patentingService.savePatenting(this.patentingData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Toast.fire({
          icon: 'success',
          title: '¡Registro actualizado con éxito!',
        });
        this._patentingService
          .getRulesByPatentingId(this.patentingData.id)
          .subscribe({
            next: (response) => {
              this.dataError = response;
            },
          });
        // this.dialogRef.close(response);
      },
      error: (err) => {
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        this.isLoading = false;
      },
    });
  }

  createOfmm() {
    const dialogRef = this.dialog.open(OfmmDialogComponent, {
      width: this.isXsOrSm ? '90%' : '60%',
      height: this.isXsOrSm ? '90%' : '70%',
      disableClose: true,
      data: {
        ofmm: v4(),
        brands: this.brands,
        terminals: this.terminals,
        carModels: this.carModels,
        patentingVersions: this.patentingVersions,
        patentingData: this.patentingData,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.isPatenting) {
        this._patentingService.fixErrorOfmm(result.zofmm).subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.error(`${this.TAG} > delete > error`, err);
            const error = ErrorHelper.getErrorMessage(err);
            this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
          },
          complete: () => {
            this.getDataByPatentingId(this.patentingId);
          },
        });
      }
    });
  }
}

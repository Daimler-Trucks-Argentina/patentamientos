import { BreakpointObserver, Breakpoints, BreakpointState, } from '@angular/cdk/layout';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA,  MatDialog, MatDialogRef, } from '@angular/material/dialog';
import * as moment from 'moment';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { Category } from 'src/app/models/categories/category.model';
import { Grado } from 'src/app/models/grados/grado.model';
import { VehicleType } from 'src/app/models/vehicle-types/vehicle-type.model';
import { OdsWholesaleCreateDto } from 'src/app/models/wholesales/ods-wholesale-create.dto';
import { OdsWholesale } from 'src/app/models/wholesales/ods-wholesale.model';
import { CategoryService } from 'src/app/services/categories/category.service';
import { GradoService } from 'src/app/services/grados/grado.service';
import { OdsWholesaleService } from 'src/app/services/odswholesales/odswholesale.service';
import { VehicleTypeService } from 'src/app/services/vehicle-types/vehicle-type.service';
import { PatentingViewDialogComponent } from '../../patenting/patenting-view-dialog/patenting-view-dialog.component';
import { v4 } from 'uuid';
import { GradoDialogComponent } from '../../catalogs/grados/grado-dialog/grado-dialog.component';
import { CarModelService } from 'src/app/services/car-models/car-model.service';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import { BrandService } from 'src/app/services/brands/brand.service';
import { WholesaleVersionService } from 'src/app/services/wholesale-versions/wholesale-version.service';

export interface DialogData {
  odsWholesale: OdsWholesale;
  grados: Grado[];
}

@Component({
  selector: 'app-sales-process-view-dialog',
  templateUrl: './sales-process-view-dialog.component.html',
  styleUrls: ['./sales-process-view-dialog.component.scss'],
})
export class SalesProcessViewDialogComponent {
  @ViewChild('registerDate', { static: true }) registerDate:  | MatDatepicker<Date> | undefined;
  TAG = SalesProcessViewDialogComponent.name;
  private unsubscribeAll: Subject<any>;
  dataError: any[] = [];
  odsWholesale: OdsWholesale = new OdsWholesale();
  filteredGrados: Grado[] = [];
  grados: Grado[] = [];
  vehicleTypes: VehicleType[] = [];
  categories: Category[] = [];
  isLoading = false;
  isXsOrSm = false;
  formGroup: FormGroup;
  grado : Grado = new Grado();
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PatentingViewDialogComponent>,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private _odsWholesaleService: OdsWholesaleService,
    private gradoService: GradoService,
    private terminalService: TerminalService,
    private brandService: BrandService,
    private carModelService: CarModelService,
    private vehicleTypeService: VehicleTypeService,
    private categoryService: CategoryService,
    private wholesaleVersionService: WholesaleVersionService,
    private sweetAlert: SweetAlert2Helper,
    private formBuilder: FormBuilder
  ) {
    this.unsubscribeAll = new Subject();
    this.odsWholesale = this.data.odsWholesale;
    this.grados = data.grados;   
    this.filteredGrados = this.grados.filter((g) => {
      const comparisonResult = new Date(g.dateTo) > new Date(new Date().toISOString()); 
      return comparisonResult;})!; //filter((g) => g.grade === this.odsWholesale.codTrademark)!;
    console.log( `${this.TAG} > constructor > this.odsWholesale`, this.odsWholesale );
    console.log( `${this.TAG} > constructor > this.grados`, this.grados  ); 
    this.formGroup = this.createFormGroup();
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

  getData(): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this.gradoService.getAll(),
      this.vehicleTypeService.getAll(),
      this.categoryService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([grados, vehicleTypes, categories]) => {
        console.log(`${this.TAG} > getData > grados`, grados);
        console.log(`${this.TAG} > getData > vehicleTypes`, vehicleTypes);
        console.log(`${this.TAG} > getData > categories`, categories);
        this.grados = grados;
        this.vehicleTypes = vehicleTypes;
        this.categories = categories;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`OdsWholesales > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('¡Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      grado: [
        {
          value: this.odsWholesale.gradoId ?? null,
          disabled: false,
        },
        [],
      ],
      yearMonth: [
        {
          value: this.odsWholesale.yearMonth ?? null,
          disabled: false,
        },
        [],
      ],
      codBrand: [
        {
          value: this.odsWholesale.codBrand ?? null,
          disabled: false,
        },
        [],
      ],
      codModel: [
        {
          value: this.odsWholesale.codModel ?? null,
          disabled: false,
        },
        [],
      ],
      codTrademark: [
        {
          value: this.odsWholesale.codTrademark ?? null,
          disabled: false,
        },
        [],
      ],
      doorsQty: [
        {
          value: this.odsWholesale.doorsQty ?? null,
          disabled: false,
        },
        [],
      ],
      engine: [
        {
          value: this.odsWholesale.engine ?? null,
          disabled: false,
        },
        [],
      ],
      motorType: [
        {
          value: this.odsWholesale.motorType ?? null,
          disabled: false,
        },
        [],
      ],
      fuelType: [
        {
          value: this.odsWholesale.fuelType ?? null,
          disabled: false,
        },
        [],
      ],
      power: [
        {
          value: this.odsWholesale.power ?? null,
          disabled: false,
        },
        [],
      ],
      powerUnit: [
        {
          value: this.odsWholesale.powerUnit ?? null,
          disabled: false,
        },
        [],
      ],
      vehicleType: [
        {
          value: this.odsWholesale.mercedesVehicleType ?? null,
          disabled: false,
        },
        [],
      ],
      traction: [
        {
          value: this.odsWholesale.traction ?? null,
          disabled: false,
        },
        [],
      ],
      gearsQty: [
        {
          value: this.odsWholesale.gearsQty ?? null,
          disabled: false,
        },
        [],
      ],
      transmissionType: [
        {
          value: this.odsWholesale.transmissionType ?? null,
          disabled: false,
        },
        [],
      ],
      axleQty: [
        {
          value: this.odsWholesale.axleQty ?? null,
          disabled: false,
        },
        [],
      ],
      weight: [
        {
          value: this.odsWholesale.weight ?? null,
          disabled: false,
        },
        [],
      ],
      loadCapacity: [
        {
          value: this.odsWholesale.loadCapacity ?? null,
          disabled: false,
        },
        [],
      ],
      category: [
        {
          value: this.odsWholesale.mercedesCategory ?? null,
          disabled: false,
        },
        [],
      ],
      origin: [
        {
          value: this.odsWholesale.origin ?? null,
          disabled: false,
        },
        [],
      ],
      initialStock: [
        {
          value: this.odsWholesale.initialStock ?? null,
          disabled: false,
        },
        [],
      ],
      import_ProdMonth: [
        {
          value: this.odsWholesale.import_ProdMonth ?? null,
          disabled: false,
        },
        [],
      ],
      import_ProdAccum: [
        {
          value: this.odsWholesale.import_ProdAccum ?? null,
          disabled: false,
        },
        [],
      ],
      monthlySale: [
        {
          value: this.odsWholesale.monthlySale ?? null,
          disabled: false,
        },
        [],
      ],
      monthlyAccum: [
        {
          value: this.odsWholesale.monthlyAccum ?? null,
          disabled: false,
        },
        [],
      ],
      exportMonthly: [
        {
          value: this.odsWholesale.exportMonthly ?? null,
          disabled: false,
        },
        [],
      ],
      exportAccum: [
        {
          value: this.odsWholesale.exportAccum ?? null,
          disabled: false,
        },
        [],
      ],
      savingSystemMonthly: [
        {
          value: this.odsWholesale.savingSystemMonthly ?? null,
          disabled: false,
        },
        [],
      ],
      savingSystemAccum: [
        {
          value: this.odsWholesale.savingSystemAccum ?? null,
          disabled: false,
        },
        [],
      ],
      finalStock: [
        {
          value: this.odsWholesale.finalStock ?? null,
          disabled: false,
        },
        [],
      ],
      noOkStock: [
        {
          value: this.odsWholesale.noOkStock ?? null,
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

  searchComparisonFn = (searchTerm: string, option: { grade: string }): boolean => { 
    return option.grade.toLowerCase().includes(searchTerm.toLowerCase());
  };

  save() {
    this.isLoading = true;
    const rawValue = this.formGroup.getRawValue();
    console.log(`${this.TAG} > save > rawValue`, rawValue);
    const createDto: OdsWholesaleCreateDto = {
      id: this.odsWholesale.id!,
      yearMonth: rawValue.yearMonth,
      codBrand: rawValue.codBrand,
      brand: rawValue.brand,
      codModel: rawValue.codModel,
      model: rawValue.model,
      codTrademark: rawValue.codTrademark,
      trademark: rawValue.trademark,
      gradoId: rawValue.grado ?? '00000000-0000-0000-0000-000000000033', //this.grado.id?? '00000000-0000-0000-0000-000000000033',//
      doorsQty: rawValue.doorsQty,
      engine: rawValue.engine,
      motorType: rawValue.motorType,
      fuelType: rawValue.fuelType,
      power: rawValue.power,
      powerUnit: rawValue.powerUnit,
      mercedesVehicleType: rawValue.mercedesVehicleType,
      vehicleTypeId: '00000000-0000-0000-0000-000000000033', //
      traction: rawValue.traction,
      gearsQty: rawValue.gearsQty,
      transmissionType: rawValue.transmissionType,
      axleQty: rawValue.axleQty,
      weight: rawValue.weight,
      loadCapacity: rawValue.loadCapacity,
      mercedesCategory: rawValue.mercedesCategory,
      categoryId: '00000000-0000-0000-0000-000000000033', //
      origin: rawValue.origin,
      initialStock: rawValue.initialStock,
      import_ProdMonth: rawValue.import_ProdMonth,
      import_ProdAccum: rawValue.import_ProdAccum,
      monthlySale: rawValue.monthlySale,
      monthlyAccum: rawValue.monthlyAccum,
      exportMonthly: rawValue.exportMonthly,
      exportAccum: rawValue.exportAccum,
      savingSystemMonthly: rawValue.savingSystemMonthly,
      savingSystemAccum: rawValue.savingSystemAccum,
      finalStock: rawValue.finalStock,
      noOkStock: rawValue.noOkStock,
      statePatentaId: '00000000-0000-0000-0000-000000000001',
      fileId: this.odsWholesale.fileId,
    };
    console.log("createDto",createDto)
    this._odsWholesaleService.saveWholesale(createDto).subscribe({
      next: (response) => {
        this.isLoading = false;
        Toast.fire({
          icon: 'success',
          title: '¡Registro actualizado con éxito!',
        });
        this.dialogRef.close(response);
      },
      error: (err) => {
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        this.isLoading = false;
      },
    });
  }

  createGrado() {
    this.isLoading = true;
    const $combineLatest = combineLatest([ this.terminalService.getAll(), this.brandService.getAll(), this.carModelService.getAll(), this.wholesaleVersionService.getAll() ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([terminals, brands, carModels, wholesaleversions]) => {
        console.log(`${this.TAG} > getData > terminals`, terminals);
        console.log(`${this.TAG} > getData > brands`, brands);
        console.log(`${this.TAG} > getData > carModels`, carModels);
        console.log(`${this.TAG} > getData > wholesaleversions`, wholesaleversions);
        terminals.forEach((t) => { t.codName = `(${t.mercedesTerminalId}) ${t.name}`; });
        brands.forEach((b) => { b.codName = `(${b.mercedesMarcaId}) ${b.name}`; });
        carModels.forEach((cm) => { cm.codName = `(${cm.mercedesModeloId}) ${cm.name}`; });
        wholesaleversions.forEach((wsv) => { wsv.codName = `(${wsv.version}) ${wsv.description}`; });
        this.isLoading = false;
        const dialogRef = this.dialog.open(GradoDialogComponent, {
          width: this.isXsOrSm ? '90%' : '65%',
          height: this.isXsOrSm ? '90%' : '60%',
          disableClose: true,
          data: {
            grado: v4(),
            terminals: terminals,
            brands: brands,
            carModels: carModels,
            wholesale: this.odsWholesale,
            versions: wholesaleversions
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log("nuevo grado", result);
          this.grado = result;
          if (!this.filteredGrados.some(grado => grado.id === result.id)) {
            this.filteredGrados.push(result);
          }
          this.formGroup.get(`grado`)?.setValue(result.id);
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`category > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

}

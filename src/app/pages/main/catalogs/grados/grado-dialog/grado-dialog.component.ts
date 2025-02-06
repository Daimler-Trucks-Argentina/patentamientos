import { BreakpointObserver, Breakpoints, BreakpointState, } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxMatSelectionChangeEvent } from 'ngx-mat-select';
import { Subject } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Brand } from 'src/app/models/brands/brand.model';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { GradoCreateDto } from 'src/app/models/grados/grado-create.dto';
import { Grado } from 'src/app/models/grados/grado.model';
import { PatentingVersion } from 'src/app/models/patenting-versions/patenting-version.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { WholesaleVersion } from 'src/app/models/wholesale-versions/wholesale-version.model';
import { OdsWholesale } from 'src/app/models/wholesales/ods-wholesale.model';
import { GradoService } from 'src/app/services/grados/grado.service';
import { v4 } from 'uuid';

export interface DialogData {
  grado: Grado;
  gradoId: string;
  brands: Brand[];
  carModels: CarModel[];
  terminals: Terminal[];
  wholesale: OdsWholesale;
  versions: WholesaleVersion[];
}

@Component({
  selector: 'app-grado-dialog',
  templateUrl: './grado-dialog.component.html',
  styleUrls: ['./grado-dialog.component.scss'],
})
export class GradoDialogComponent {
  TAG = 'GradoDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  events: string[] = [];
  minDate = new Date(1000, 0, 1);
  grado: Grado = new Grado();
  brands: Brand[] = [];
  brandId: string = '';
  filteredBrands: Brand[] = [];
  carModels: CarModel[] = [];
  carModel: CarModel = new CarModel();
  filteredCarModels: CarModel[] = [];
  filteredVersionWs: WholesaleVersion[] = [];
  versions: WholesaleVersion[] = [];
  terminals: Terminal[] = [];
  terminalId: string = '';
  isLoading = false;
  wholesale: OdsWholesale = new OdsWholesale();
  filteredPatentingVersions: PatentingVersion[] = [];

  constructor(
    private dialogRef: MatDialogRef<GradoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public gradoService: GradoService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.grado = data.grado;
    this.terminals = data.terminals;
    this.brands = data.brands;
    this.filteredBrands = data.grado.id ? data.brands : [];
    this.carModels = data.carModels;
    this.filteredCarModels = data.grado.id ? data.carModels : [];  
    this.versions = data.versions;
    this.filteredVersionWs = this.versions?.filter(vws =>
      data.grado.carModel?.mercedesModeloId == vws.mercedesModeloId &&
      data.grado.carModel?.mercedesMarcaId == vws.mercedesMarcaId &&
      data.grado.carModel?.mercedesTerminalId == vws.mercedesTerminalId
    );
    this.wholesale = data.wholesale;
    console.log(`${this.TAG} > constructor > this.grado`, this.grado);
    console.log(`${this.TAG} > constructor > this.brands`, this.brands);
    console.log(`${this.TAG} > constructor > this.terminals`, this.terminals);
    console.log(`${this.TAG} > constructor > this.carModels`, this.carModels);
    console.log(`${this.TAG} > constructor > this.wholesale`, this.wholesale);
    if (data.grado.carModelId) {
      this.carModel = data.carModels.find(
        (cm) => cm.id === data.grado.carModelId
      )!;
      console.log('this.carModel', this.carModel);
    }
    if (this.grado.id) {
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
    const verWs = this.filteredVersionWs.find(vws => vws.version === this.grado.versionWs);//aca devuelvo el objeto version con ese id y se lo paso aca en formgroup versionWs
    const validoDesdeStr = this.grado.dateFrom?.toString();
    let validoDesde = new Date(validoDesdeStr!);
    validoDesde.setHours(validoDesde.getHours() + 4); 
    if (!this.grado.dateFrom) { 
      validoDesde = new Date('1000-01-01');
      validoDesde.setHours(validoDesde.getHours() + 4); 
    }    

    const validoHastaStr = this.grado.dateTo?.toString();
    let validoHasta = new Date(validoHastaStr!);
    validoHasta.setHours(validoHasta.getHours() + 4);
    if (!this.grado.dateTo) { 
      validoHasta = new Date('9999-12-31');
      validoHasta.setHours(validoHasta.getHours() + 4);
    }
  
    const formGroup = this.formBuilder.group({
      marcaWsDesc: [
        {
          value: this.wholesale?.codBrand ?? this.grado.carModel?.brand?.mercedesMarcaId, 
          disabled: false,
        }, 
      ],
      modeloWsDesc: [
        { 
          value: this.wholesale?.codModel ?? this.grado.carModel?.mercedesModeloId,
          disabled: false,
        }, 
      ],
      gradeDesc: [
        {
          value: this.wholesale?.codTrademark ?? this.grado.grade,
          disabled: false,
        }, 
      ],

      marcaWs: [
        {
          value: this.wholesale?.codBrand ?? this.grado.marcaWs,
          disabled: false,
        },
        [Validators.required],
      ],
      modeloWs: [
        {
          value: this.wholesale?.codModel ??  this.grado.modeloWs,
          disabled: false,
        },
        [Validators.required],
      ],
      grade: [
        {
          value: this.wholesale?.codTrademark ?? this.grado.grade ,
          disabled: false,
        },
        [Validators.required],
      ],
      dateTo: [
        {
          value: validoHasta ?? new Date('9999-12-31'),
          disabled: false,
        },
        [Validators.required],
      ],
      dateFrom: [
        {
          value: validoDesde ?? new Date('1000-01-01'),
          disabled: false,
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
          value:  this.wholesale?.brand ??  this.carModel.brandId,
          disabled: false,
        },
        [],
      ],
      carModelId: [
        {
          value: this.carModel ??  null,
          disabled: false,
        },
        [Validators.required],
      ],
      versionWs: [
        {
          value: verWs?.version?? null,
          disabled: false,
        },
        [Validators.required],
      ],
      dischargeDate: [
        {
          value: this.grado.dischargeDate ?? new Date(),
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
    const terminal = this.terminals.find((t) => t.id == this.terminalId);
    const brand = this.brands.find((b) => b.id == this.brandId);
    const carModel = this.carModels.find((cm) => cm.id == rawValue.carModelId);
    const createDto: GradoCreateDto = {
      id: this.grado.id ?? v4(),
      marcaWs: rawValue.marcaWs,
      modeloWs: rawValue.modeloWs,
      grade: rawValue.grade,
      dateTo: rawValue.dateTo,
      dateFrom: rawValue.dateFrom,
      mercedesTerminalId: terminal?.mercedesTerminalId! || this.carModel.mercedesTerminalId!,
      mercedesMarcaId: brand?.mercedesMarcaId! || this.carModel.mercedesMarcaId!,
      mercedesModeloId: carModel?.mercedesModeloId! || this.carModel.mercedesModeloId!,
      carModelId: typeof rawValue.carModelId === 'string' ? rawValue.carModelId : rawValue.carModelId?.id,
      versionWs: rawValue.versionWs,
      dischargeDate: rawValue.dischargeDate,
    };
    console.log('createDto', createDto);
    console.log('CAR MODEL', this.carModel);
    if (this.actionMode === ActionMode.create) {
      this.create(createDto);
    }
    if (this.actionMode === ActionMode.update) {
      this.update(createDto);
    }
  }

  create(createDto: GradoCreateDto): void {
    this.gradoService.create(createDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Grado guardado con éxito!',
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

  update(updateDto: GradoCreateDto): void {
    this.gradoService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Grado actualizado con éxito!',
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
    this.formGroup.get('marcaId')?.setValue(null);
    this.formGroup.get('carModelId')?.setValue(null);
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

  filterVersionWs(event: NgxMatSelectionChangeEvent) {
    this.filteredVersionWs = [];
    this.carModel.id = event.value as string;
    const carModel = this.carModels.find((cm) => event.value == cm.id);
    this.filteredVersionWs = this.versions?.filter(vws =>
      carModel?.mercedesModeloId == vws.mercedesModeloId &&
      carModel?.mercedesMarcaId == vws.mercedesMarcaId &&
      carModel?.mercedesTerminalId == vws.mercedesTerminalId
    );
    this.formGroup.get('versionWs')?.setValue(null);
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }
}

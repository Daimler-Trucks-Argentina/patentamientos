import { SelectionModel } from '@angular/cdk/collections';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
  NgxMatSelectComponent,
  NgxMatSelectionChangeEvent,
} from 'ngx-mat-select';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import screenfull from 'screenfull';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Rule } from 'src/app/models/rules/rule.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BrandService } from 'src/app/services/brands/brand.service';
import { CarModelService } from 'src/app/services/car-models/car-model.service';
import { PatentingService } from 'src/app/services/patentings/patenting.service';
import { RuleService } from 'src/app/services/rules/rule.service';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import { MultipleOfmmDialogComponent } from '../catalogs/ofmms/multiple-ofmm-dialog/multiple-ofmm-dialog.component';
import { PatentingViewDialogComponent } from './patenting-view-dialog/patenting-view-dialog.component';
import { PatentingVersionService } from 'src/app/services/patenting-versions/patenting-version.service';
import { utils, WorkBook, WorkSheet, write, writeFileXLSX } from 'xlsx';
import { CustomPaginatorIntl } from 'src/app/shared/components/paginator/custom-paginator-intl';

@Component({
  selector: 'app-patenting',
  templateUrl: './patenting.component.html',
  styleUrls: ['./patenting.component.scss'],
})

export class PatentingComponent implements OnInit, AfterViewInit {
  TAG = PatentingComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  patentings: any[] = [];
  rules: Rule[] = [];
  isXsOrSm = false;
  isLoading = false;
  showErrors = false;
  showFilter = false;
  fileId: string = '';
  options = [
    { id: 0, name: 'Todo' },
    { id: 1, name: 'OFMM' },
    { id: 2, name: 'Motor' },
  ];
  ofmms: any[] = [];
  defaultFilterPredicate?: (data: any, filter: string) => boolean;
  errorsQty = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(NgxMatSelectComponent) filterPat!: NgxMatSelectComponent;
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;
  @ViewChild(MatSelect) matSelect!: MatSelect;
  @ViewChild(MatCheckbox) matCheckbox!: MatCheckbox;

  sortDirection: SortDirection = 'asc';
  fullScreen = {
    isEnabled: false,
    isFullscreen: false,
  };
  pageSizeOptions: number[] = [50, 100, 500, 1000];
  pageSize: number = this.pageSizeOptions[0];
  pageNumber: number = 1;
  totalItems?: number;
  code: any = { value: '' };
  lastDischarge: boolean = false;
  form = new FormGroup({
    fromDate: new FormControl(null, { validators: [Validators.required] }),
    toDate: new FormControl(null, { validators: [Validators.required] }),
  });
  get fromDate() {
    return this.form.get('fromDate')!.value;
  }
  get toDate() {
    return this.form.get('toDate')!.value;
  }
  pipe: DatePipe;
  displayedColumnsFullScreen: string[] = [
    'fecha_inscripcion',
    'fecha_corte',
    'patente',
    'ofmm',
    'fmm_tmm',
    'origen',
    'texto_1',
    'marca_D',
    'texto_2',
    'tipotexto',
    'estado',
    'acciones',
    // 'marca',
    // 'modelo',
    // 'chasis',
    // 'motor',
    // 'fabrica',
  ];
  displayedColumnsNoFullScreen: string[] = [
    'acciones',
    'fecha_inscripcion',
    'fecha_corte',
    'patente',
    'ofmm',
    'fmm_tmm',
    'origen',
    'texto_1',
    'marca_D',
    'texto_2',
    'tipotexto',
    'estado',
    // 'marca',
    // 'modelo',
    // 'fabrica',
    // 'chasis',
    // 'motor',
  ];
  displayedColumns: string[];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private _patentingService: PatentingService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private ruleService: RuleService,
    private terminalService: TerminalService,
    private brandService: BrandService,
    private carModelService: CarModelService,
    private patentingVersionService: PatentingVersionService,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.displayedColumns = this.displayedColumnsNoFullScreen;
    this.unsubscribeAll = new Subject();
    this.activatedRoute.queryParams.subscribe((p) => {
      this.fileId = p['fileId'];
      if (this.fileId != undefined) {
        this.sortDirection = 'desc';
        this.getDataByFileId(this.fileId);
      } else {
        this.dataSource.data = [];
        this.errorsQty = 0;
      }
      // this.fileId != undefined
      //   ? this.getDataByFileId(this.fileId)
      //   : this.getAllPatentings();
    });
    this.pipe = new DatePipe('en');
    console.log(this.dataSource.filterPredicate);
    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data, filter) => {
      const formatted = this.pipe.transform(data.fechInsc, 'MM/dd/yyyy');
      return formatted!.indexOf(filter) >= 0 || defaultPredicate(data, filter);
    };
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
    this.defaultFilterPredicate = this.dataSource.filterPredicate;
    this.getRules();
    this.filterPatentings();
  }

  ngAfterViewInit() {
    this.paginator._intl = new CustomPaginatorIntl();
    this.paginator._intl.itemsPerPageLabel = 'Registros:';
    this.paginator._intl.changes.next();
    this.paginator.page.subscribe((event: PageEvent) => {
      this.pageNumber = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.filterPatentings();
    });
  }

  getDataByFileId(fileId: string): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this._patentingService.getByFileId(fileId),
      this.ruleService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([patentings, rules]) => {
        this.rules = rules;
        this.patentings = patentings;
        this.totalItems = patentings.length;
        this.dataSource = new MatTableDataSource<any>(this.patentings);

        this.paginator.length = this.totalItems;
        this.paginator.pageSize = this.pageSize;

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

  getRules(): void {
    const $combineLatest = combineLatest([this.ruleService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([rules]) => {
        console.log(`${this.TAG} > getData > rules`, rules);
        this.rules = rules;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`Patentings > getRules > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('¡Ha ocurrido un error!', error, null, true);
      },
    });
  }

  downloadXLS(): void {
    this.isLoading = true;
    const dates = this.form.getRawValue();
    const dateFrom: string = dates.fromDate ? new Date(dates.fromDate!).toISOString() : '';
    const dateTo: string = dates.toDate ? new Date(dates.toDate!).toISOString() : new Date().toISOString();
    const lastDischarge: boolean = this.lastDischarge;
    const errorType: string = this.code.value;
    const fileId: string = this.fileId ?? '';

    this._patentingService
      .getPatentingsByFilter(dateFrom, dateTo, lastDischarge, errorType, fileId, 1, this.totalItems)
      .subscribe({
        next: (response) => {
          console.log('Datos recibidos:', response.results);

          if (!response.results || response.results.length === 0) {
            console.warn('No hay datos para exportar.');
            this.isLoading = false;
            this.sweetAlert.warning('Atención', 'No hay datos para exportar.', null, true);
            return;
          }

          const cleanedData = response.results.map(this.flattenData);

          console.log('Datos transformados:', cleanedData);

          const worksheet: WorkSheet = utils.json_to_sheet(cleanedData, {
            header: Object.keys(cleanedData[0])
          });

          const workbook: WorkBook = {
            Sheets: { patentamientos: worksheet },
            SheetNames: ['patentamientos']
          };

          const excelBuffer: any = write(workbook, {
            bookType: 'xlsx',
            type: 'array'
          });

          console.log('Buffer generado:', excelBuffer);

          this.saveAsExcelFile(excelBuffer, 'patentamientos');
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          const error = ErrorHelper.getErrorMessage(err);
          this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        },
      });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    try {
      const data: Blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url: string = window.URL.createObjectURL(data);
      const a: HTMLAnchorElement = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log(`Archivo ${fileName}.xlsx guardado con éxito.`);
    } catch (error) {
      console.error('Error al guardar el archivo:', error);
      this.sweetAlert.error('Error', 'No se pudo descargar el archivo.', null, true);
    }
  }

  flattenData(item: any): any {
    const flattened: any = {};

    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        if (typeof item[key] === 'object' && item[key] !== null) {
          for (const nestedKey in item[key]) {
            if (item[key].hasOwnProperty(nestedKey)) {
              flattened[`${key}_${nestedKey}`] = item[key][nestedKey];
            }
          }
        } else {
          flattened[key] = item[key];
        }
      }
    }

    return flattened;
  }


  createOrUpdate(patentingId?: string) {
    const dialogRef = this.dialog.open(PatentingViewDialogComponent, {
      width: this.isXsOrSm ? '90%' : '60%',
      height: this.isXsOrSm ? '90%' : '70%',
      disableClose: true,
      data: { patentingId: patentingId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.filterPatentings();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetTable() {
    this.dataSource.data = this.patentings;
    const filtered = this.patentings.filter(
      (res) => res.statePatenta.name == 'Error'
    );
    if (this.code.value) {
      this.filterByCode(this.code);
    }
    this.errorsQty = filtered.length;
  }

  confirmDelete(patentingObject: any, callback?: any) {
    const patenting = `${patentingObject.plate ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar el dominio "${patenting}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(patentingObject.id ?? '');
      }
    );
  }

  delete(patentingId: string): void {
    this._patentingService.delete(patentingId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Dominio eliminado con éxito!',
        });
        this.getDataByFileId(this.fileId);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`${this.TAG} > delete > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  filterPatentingBySearchSelect(
    option: NgxMatSelectionChangeEvent,
    value: any
  ) {
    let options: any[] = this.filterPat.value;
    const filterOfmm = (data: any, filter: string): boolean => {
      return data.ofmm.toLocaleLowerCase().includes(filter);
    };

    const filterMotor = (data: any, filter: string): boolean => {
      return data.motor.toLocaleLowerCase().includes(filter);
    };

    const filterBoth = (data: any, filter: string): boolean => {
      const selectedData = data.motor + data.ofmm;
      return selectedData.toLocaleLowerCase().includes(filter);
    };

    if (option.value === 0 && option.selected === true) {
      this.filterPat.setValue(0, true);
      options = [0];
      this.dataSource.filterPredicate = this.defaultFilterPredicate!;
    }
    if (option.value === 1 || option.value === 2) {
      this.filterPat.value = this.filterPat.value.filter((e: any) => e != 0);
      options = this.filterPat.value;
    }
    if (options.includes(1) && !options.includes(2)) {
      this.dataSource.filterPredicate = filterOfmm;
    } else if (options.includes(2) && !options.includes(1)) {
      this.dataSource.filterPredicate = filterMotor;
    } else if (options.includes(1) && options.includes(2)) {
      this.dataSource.filterPredicate = filterBoth;
    }
    this.dataSource.filter = value.trim().toLowerCase();
  }

  openFilter() {
    this.filterPat.panel.open();
  }

  toggleLastDischarge(checkbox: MatCheckboxChange) {
    this.lastDischarge = checkbox.checked;
    console.log('this.lastDischarge', this.lastDischarge);
  }

  toggleFullscreen() {
    console.log(screenfull);

    if (!this.fullScreen.isEnabled) {
      this.fullScreen.isEnabled = true;
      if (!screenfull.isFullscreen) screenfull.toggle();
      this.displayedColumns = this.displayedColumnsFullScreen;
      this.fileId ? this.getDataByFileId(this.fileId) : this.filterPatentings();
      this.pageSize = 20;
      this.authService.onDrawerOpenedEmitter.emit(false);
      this.authService.onHeaderEmitter.emit(false);
    } else {
      this.fullScreen.isEnabled = false;
      this.displayedColumns = this.displayedColumnsNoFullScreen;
      this.fileId ? this.getDataByFileId(this.fileId) : this.filterPatentings();
      this.pageSize = 5;
      this.authService.onDrawerOpenedEmitter.emit(true);
      this.authService.onHeaderEmitter.emit(true);
      if (screenfull.isFullscreen) screenfull.toggle();
    }
  }

  filterByCode(code: MatSelectChange) {
    this.code = code;
    console.log('this.code', this.code);
  }

  logSelection() {
    console.log('this.selection', this.selection);
    console.log('this.selection.selected', this.selection.selected);
  }

  createMultipleOfmms() {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this.terminalService.getAll(),
      this.brandService.getAll(),
      this.carModelService.getAll(),
      this.patentingVersionService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([terminals, brands, carModels, patentingVersions]) => {
        console.log(`${this.TAG} > getData > terminals`, terminals);
        console.log(`${this.TAG} > getData > brands`, brands);
        console.log(`${this.TAG} > getData > carModels`, carModels);
        terminals.forEach((t) => {
          t.codName = `(${t.mercedesTerminalId}) ${t.name}`;
        });
        brands.forEach((b) => {
          b.codName = `(${b.mercedesMarcaId}) ${b.name}`;
        });
        carModels.forEach((cm) => {
          cm.codName = `(${cm.mercedesModeloId}) ${cm.name}`;
        });
        patentingVersions.forEach((pv) => {
          pv.codName = `(${pv.version}) ${pv.description}`;
        });
        this.isLoading = false;
        const dialogRef = this.dialog.open(MultipleOfmmDialogComponent, {
          width: this.isXsOrSm ? '90%' : '100%',
          height: this.isXsOrSm ? '90%' : 'auto',
          disableClose: true,
          data: {
            ofmms: this.selection.selected,
            terminals: terminals,
            brands: brands,
            carModels: carModels,
            patentingVersions: patentingVersions,
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log(result);
          if (result) {
            this.selection.clear();
            result.forEach((o: any) => {
              this._patentingService.fixErrorOfmm(o.zofmm).subscribe({
                next: (res) => {
                  this.fileId
                    ? this.getDataByFileId(this.fileId)
                    : this.filterPatentings();
                },
                error: (err) => {
                  console.error(`${this.TAG} > delete > error`, err);
                  const error = ErrorHelper.getErrorMessage(err);
                  this.sweetAlert.error(
                    'Ha ocurrido un error!',
                    error,
                    null,
                    true
                  );
                },
              });
            });
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`${this.TAG} > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  toggleFilter() {
    if (!this.showFilter) {
      this.showFilter = true;
      this.expansionPanel.open();
    } else {
      this.showFilter = false;
      this.expansionPanel.close();
    }
  }

  filterPatentings(pageNumber?: number, pageSize?: number) {
    this.isLoading = true;
    const dates = this.form.getRawValue();
    const dateFrom: string = dates.fromDate
      ? new Date(dates.fromDate!).toISOString()
      : '';
    const dateTo: string = dates.toDate
      ? new Date(dates.toDate!).toISOString()
      : '';
    const lastDischarge: boolean = this.lastDischarge;
    const errorType: string = this.code.value;
    const fileId: string = this.fileId ?? '';

    this._patentingService
      .getPatentingsByFilter(
        dateFrom,
        dateTo,
        lastDischarge,
        errorType,
        fileId,
        (pageNumber = this.pageNumber),
        (pageSize = this.pageSize)
      )
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource<any>(response.results);
          this.totalItems = response.totalItems;
          this.pageNumber = response.pageNumber;
          this.pageSize = response.pageSize;


          if (this.dataSource.data.length === 0) {
            Toast.fire({
              icon: 'info',
              title: 'No se encontraron resultados.',
            });
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          const error = ErrorHelper.getErrorMessage(err);
          this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.filterPatentings(this.pageNumber);
  }

  resetFiltering() {
    this.form.reset();
    this.matSelect.options.forEach((data: MatOption) => data.deselect());
    this.code.value = '';
    this.matCheckbox['checked'] = false;
    this.lastDischarge = false;
  }
}

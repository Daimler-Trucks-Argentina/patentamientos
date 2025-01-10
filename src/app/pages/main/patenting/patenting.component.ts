import { SelectionModel } from '@angular/cdk/collections';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
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
  pageSize: number = 5;
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
    private patentingVersionService: PatentingVersionService
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
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros:';
    this.dataSource.sort = this.sort;
    Promise.resolve().then(() => this.filterPat.setValue(0, true));
    if (!this.fileId) Promise.resolve().then(() => this.toggleFilter());
  }

  getDataByFileId(fileId: string): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this._patentingService.getByFileId(fileId),
      this.ruleService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([patentings, rules]) => {
        console.log(`${this.TAG} > getData > patentings`, patentings);
        patentings.forEach((p) => {
          p.fechInsc = new Date(p.fechInsc);
        });
        console.log(`${this.TAG} > getData > rules`, rules);
        this.rules = rules;
        this.patentings = patentings;
        this.dataSource = new MatTableDataSource<any>(this.patentings);
        const filtered = this.patentings.filter(
          (res) => res.statePatenta.name == 'Error'
        );
        this.errorsQty = filtered.length;
        this.sortAndPaginate();
        if (this.code.value) {
          this.filterByCode(this.code);
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

  getAllPatentings(): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this._patentingService.getAllPatentings(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([patentings]) => {
        console.log(`${this.TAG} > getData > patentings`, patentings);
        patentings.forEach((p) => {
          p.fechInsc = new Date(p.fechInsc);
        });
        this.patentings = patentings;
        this.dataSource = new MatTableDataSource<any>(this.patentings);
        const filtered = this.patentings.filter(
          (res) => res.statePatenta.name == 'Error'
        );
        this.errorsQty = filtered.length;
        this.sortAndPaginate();
        if (this.code.value) {
          this.filterByCode(this.code);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`Patentings > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('¡Ha ocurrido un error!', error, null, true);
      },
    });
  }

  sortAndPaginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'fecha_inscripcion':
          return item.fechInsc;
        case 'fecha_corte':
          return item.closure.fechaCorte;
        case 'texto_1':
          // return item.texto1OFMM;
          return item.fabrica_D;
        case 'marca_D':
          // return item.texto1OFMM;
          return item.marca_D;
        case 'texto_2':
          // return item.texto2OFMM;
          return item.modelo_D;
        case 'tipotexto':
          // return item.tipoTextoOFMM;
          return item.tipo_D;
        case 'fmm_tmm':
          return item.fmM_MTM;
        case 'fabrica':
          return item.factory.name;
        case 'marca':
          return item.carModel.brand.name;
        case 'modelo':
          return item.carModel.name;
        case 'patente':
          return item.plate;
        default:
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
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
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // getDateRange(value: any) {
  //   this.dataSource.data = this.patentings;
  //   const fromDate = value.fromDate;
  //   const toDate = value.toDate ?? new Date();
  //   this.dataSource.data = this.dataSource.data
  //     .filter((e) => e.fechInsc > fromDate! && e.fechInsc < toDate!)
  //     .sort((a, b) => a.fechInsc - b.fechInsc);
  //   const filtered = this.dataSource.data.filter(
  //     (res) => res.statePatenta.name == 'Error'
  //   );
  //   if (this.code.value) {
  //     this.filterByCode(this.code);
  //   }
  //   this.errorsQty = filtered.length;
  //   if (this.dataSource.data.length === 0) {
  //     Toast.fire({
  //       icon: 'info',
  //       title: 'No se encontraron resultados.',
  //     });
  //   }
  //   console.log(fromDate, toDate);
  // }

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

  // showOnlyErrors(showErrors: boolean) {
  //   if (showErrors) {
  //     const filtered = this.patentings.filter(
  //       (res) => res.statePatenta.name == 'Error'
  //     );
  //     console.log(filtered);
  //     this.errorsQty = filtered.length;
  //     this.dataSource = new MatTableDataSource<any>(filtered);
  //     this.sortAndPaginate();
  //   } else {
  //     this.dataSource = new MatTableDataSource<any>(this.patentings);
  //     this.sortAndPaginate();
  //   }
  // }

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

    // if (checkbox.checked) {
    //   // const lastDate = new Date(
    //   //   Math.max(...this.patentings.map((p) => p.fechaRegistro))
    //   // );
    //   // const pipedLastDate = formatDate(lastDate, 'dd/MM/yyyy', 'en');
    //   // let filteredPatentings;
    //   // filteredPatentings = JSON.parse(JSON.stringify(this.patentings));
    //   // filteredPatentings.forEach((p: any) => {
    //   //   p.fechaRegistro = formatDate(p.fechaRegistro, 'dd/MM/yyyy', 'en');
    //   // });
    //   // filteredPatentings = filteredPatentings.filter(
    //   //   (p: any) => p.fechaRegistro === pipedLastDate
    //   // );
    //   // this.dataSource = new MatTableDataSource<any>(filteredPatentings);
    //   // this.sortAndPaginate();
    //   this.isLoading = true;
    //   this._patentingService.getLastFilePatenting().subscribe({
    //     next: (response) => {
    //       console.log(`${this.TAG} > getData > _patentingService`, response);
    //       this.dataSource = new MatTableDataSource<any>(response);
    //       this.errorsQty = response.length;
    //       this.sortAndPaginate();
    //       if (this.code.value) {
    //         this.filterByCode(this.code);
    //       }
    //       this.isLoading = false;
    //     },
    //     error: (err) => {
    //       this.isLoading = false;
    //       console.error(`${this.TAG} > save > create > err`, err);
    //       const error = ErrorHelper.getErrorMessage(err);
    //       this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
    //     },
    //   });
    // } else {
    //   this.dataSource = new MatTableDataSource<any>(this.patentings);
    //   this.errorsQty = this.patentings.length;
    //   this.sortAndPaginate();
    //   if (this.code.value) {
    //     this.filterByCode(this.code);
    //   }
    // }
  }

  toggleFullscreen() {
    console.log(screenfull);

    if (!this.fullScreen.isEnabled) {
      this.fullScreen.isEnabled = true;
      if (!screenfull.isFullscreen) screenfull.toggle();
      this.displayedColumns = this.displayedColumnsFullScreen;
      this.fileId ? this.getDataByFileId(this.fileId) : this.getAllPatentings();
      this.pageSize = 150;
      this.authService.onDrawerOpenedEmitter.emit(false);
      this.authService.onHeaderEmitter.emit(false);
    } else {
      this.fullScreen.isEnabled = false;
      this.displayedColumns = this.displayedColumnsNoFullScreen;
      this.fileId ? this.getDataByFileId(this.fileId) : this.getAllPatentings();
      this.pageSize = 5;
      this.authService.onDrawerOpenedEmitter.emit(true);
      this.authService.onHeaderEmitter.emit(true);
      if (screenfull.isFullscreen) screenfull.toggle();
    }
  }

  filterByCode(code: MatSelectChange) {
    this.code = code;
    console.log('this.code', this.code);

    // if (code.value === 'all') {
    //   this.dataSource = new MatTableDataSource<any>(this.patentings);
    //   this.errorsQty = this.patentings.length;
    //   this.sortAndPaginate();
    //   return;
    // }
    // this.dataSource.data = this.patentings;
    // const filtered = this.dataSource.data.filter(
    //   (p) => p.errores === code.value
    // );
    // this.dataSource = new MatTableDataSource<any>(filtered);
    // this.errorsQty = filtered.length;
    // this.sortAndPaginate();
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

  filterPatentings() {
    this.isLoading = true;
    const dates = this.form.getRawValue();
    const dateFrom: string = dates.fromDate
      ? new Date(dates.fromDate!).toISOString()
      : '';
    const dateTo: string = dates.toDate
      ? new Date(dates.toDate!).toISOString()
      : new Date().toISOString();
    const lastDischarge: boolean = this.lastDischarge;
    const errorType: string = this.code.value;
    const fileId: string = this.fileId ?? '';

    console.log('dates', dates);
    console.log('dateFrom', dateFrom);
    console.log('dateTo', dateTo);
    console.log('errorType', errorType);
    console.log('lastDischarge', lastDischarge);
    console.log('fileId', fileId);

    this._patentingService
      .getPatentingsFiltered(dateFrom, dateTo, lastDischarge, errorType, fileId)
      .subscribe({
        next: (response) => {
          console.log(
            `${this.TAG} > _patentingService > getPatentingsFiltered`,
            response
          );
          this.dataSource = new MatTableDataSource<any>(response);
          this.errorsQty = response.length;
          this.sortAndPaginate();
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
          console.error(`${this.TAG} > save > create > err`, err);
          const error = ErrorHelper.getErrorMessage(err);
          this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        },
      });
  }

  resetFiltering() {
    this.form.reset();
    this.matSelect.options.forEach((data: MatOption) => data.deselect());
    this.code.value = '';
    this.matCheckbox['checked'] = false;
    this.lastDischarge = false;
  }
}

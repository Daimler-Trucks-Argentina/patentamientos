import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import screenfull from 'screenfull';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Rule } from 'src/app/models/rules/rule.model';
import { OdsWholesale } from 'src/app/models/wholesales/ods-wholesale.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OdsWholesaleService } from 'src/app/services/odswholesales/odswholesale.service';
import { RuleService } from 'src/app/services/rules/rule.service';
import { SalesProcessViewDialogComponent } from './sales-process-view-dialog/sales-process-view-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Grado } from 'src/app/models/grados/grado.model';
import { GradoService } from 'src/app/services/grados/grado.service';

@Component({
  selector: 'app-sales-process',
  templateUrl: './sales-process.component.html',
  styleUrls: ['./sales-process.component.scss'],
})
export class SalesProcessComponent implements OnInit {
  TAG = SalesProcessComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  odsWholesales: OdsWholesale[] = [];
  rules: Rule[] = [];
  grados: Grado[] = [];
  isXsOrSm = false;
  isLoading = false;
  showErrors = false;
  fileId: string = '';
  errorsQty = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  fullScreen = {
    isEnabled: false,
    isFullscreen: false,
  };
  pageSize: number = 8;
  code: any = { value: '' };
  displayedColumns: string[] = [
    'acciones',
    'estado',
    'yearMonth',
    'codBrand',
    'Brand',
    'codModel',
    'Model',
    'codTrademark',
    'Trademark',
    'doorsQty',
    'engine',
    'motorType',
    'fuelType',
    'power',
    'powerUnit',
    'vehicleType',
    'traction',
    'gearsQty',
    'transmissionType',
    'axleQty',
    'weight',
    'loadCapacity',
    'category',
    'origin',
    'initialStock',
    'import_ProdMonth',
    'import_ProdAccum',
    'monthlySale',
    'monthlyAccum',
    'exportMonthly',
    'exportAccum',
    'savingSystemMonthly',
    'savingSystemAccum',
    'finalStock',
    'noOkStock',
    
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private _odsWholesaleService: OdsWholesaleService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private ruleService: RuleService,
    private gradoService: GradoService
  ) {
    this.unsubscribeAll = new Subject();
    this.activatedRoute.queryParams.subscribe((p) => {
      this.fileId = p['fileId'];
      this.fileId != undefined ? this.getDataByFileId(this.fileId) : this.getAllOdsWholesales();
    });
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

  getDataByFileId(fileId: string): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this._odsWholesaleService.getByFileId(fileId),
      this.ruleService.getAll(),
      this.gradoService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([odsWholesales, rules, grados]) => {
        console.log(`${this.TAG} > getData > odsWholesales`, odsWholesales);
        console.log(`${this.TAG} > getData > rules`, rules);
        console.log(`${this.TAG} > getData > grados`, grados);
        this.odsWholesales = odsWholesales.filter((res) => res.statePatenta?.name === 'Error');
        this.rules = rules;
        this.grados = grados;
        this.dataSource = new MatTableDataSource<any>(this.odsWholesales);
        this.errorsQty = this.odsWholesales.length;
        this.sortAndPaginate();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`OdsWholesales > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  getAllOdsWholesales(): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this._odsWholesaleService.getAll(),
      this.ruleService.getAll(),
      this.gradoService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([odsWholesales, rules, grados]) => {
        console.log(`${this.TAG} > getData > odsWholesales`, odsWholesales);
        console.log(`${this.TAG} > getData > rules`, rules);
        console.log(`${this.TAG} > getData > grados`, grados);
        this.rules = rules;
        this.odsWholesales = odsWholesales.filter((res) => res.statePatenta?.name === 'Error');
        this.grados = grados;
        this.dataSource = new MatTableDataSource<any>(this.odsWholesales);
        this.errorsQty = this.odsWholesales.length;
        this.sortAndPaginate();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`OdsWholesales > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  sortAndPaginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'yearMonth':
          return item.yearMonth;
        case 'vehicleType':
          return item.mercedesVehicleType;
        case 'category':
          return item.mercedesCategory;
        case 'exportMonthly':
          return item.exportMonthly;
        case 'savingSystemMonthly':
          return item.savingSystemMonthly;
        case 'noOkStock':
          return item.noOkStock;
        default:
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleFullscreen() {
    console.log(screenfull); 
    if (!this.fullScreen.isEnabled) {
      this.fullScreen.isEnabled = true;
      if (!screenfull.isFullscreen) screenfull.toggle();
      this.fileId ? this.getDataByFileId(this.fileId) : this.getAllOdsWholesales();
      this.pageSize = 150;
      this.authService.onDrawerOpenedEmitter.emit(false);
      this.authService.onHeaderEmitter.emit(false);
    } else {
      this.fullScreen.isEnabled = false;
      this.fileId ? this.getDataByFileId(this.fileId) : this.getAllOdsWholesales();
      this.pageSize = 5;
      this.authService.onDrawerOpenedEmitter.emit(true);
      this.authService.onHeaderEmitter.emit(true);
      if (screenfull.isFullscreen) screenfull.toggle();
    }
  }

  createOrUpdate(odsWholesale?: OdsWholesale) {
    const dialogRef = this.dialog.open(SalesProcessViewDialogComponent, {
      width: this.isXsOrSm ? '90%' : '60%',
      height: this.isXsOrSm ? '90%' : '70%',
      disableClose: true,
      data: { odsWholesale: odsWholesale, grados: this.grados },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.fileId
        ? this.getDataByFileId(this.fileId)
        : this.getAllOdsWholesales();
    });
  }

  confirmDelete(wholesaleObject: OdsWholesale, callback?: any) {
    const wholesale = `${wholesaleObject.codTrademark ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar la venta "${wholesale}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(wholesaleObject.id ?? '');
      }
    );
  }

  delete(wholesaleId: string): void {
    this._odsWholesaleService.delete(wholesaleId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Venta eliminada con éxito!',
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
}

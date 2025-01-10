import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import screenfull from 'screenfull';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { OdsSpecialWholesale } from 'src/app/models/special-wholesales/ods-special-wholesale.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OdsSpecialWholesaleService } from 'src/app/services/ods-special-wholesales/ods-special-wholesale.service';

@Component({
  selector: 'app-special-sales-process',
  templateUrl: './special-sales-process.component.html',
  styleUrls: ['./special-sales-process.component.scss']
})
export class SpecialSalesProcessComponent {
  TAG = SpecialSalesProcessComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  odsSpecialWholesales: OdsSpecialWholesale[] = [];
  isXsOrSm = false;
  isLoading = false;
  showErrors = false;
  fileId: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  fullScreen = {
    isEnabled: false,
    isFullscreen: false,
  };
  pageSize: number = 8;
  code: any = { value: '' };
  displayedColumns: string[] = [
    'cuitOwner',
    'owner',
    'mercedesLegalEntity',
    'mercedesGovernmentalClassification',
    'mercedesSubgovernmentalClassification',
    'mercedesCuitClassification',
    'mercedesAperture1',
    'mercedesAperture2',
    'mercedesLogisticClassification',
    'mercedesEstimatedTurnover',
    'socialContractDate',
    'employeesInfo',
    'quantity',
    // 'acciones',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private _odsSpecialWholesaleService: OdsSpecialWholesaleService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.unsubscribeAll = new Subject();
    this.activatedRoute.queryParams.subscribe((p) => {
      this.fileId = p['fileId'];
      this.fileId != undefined
        ? this.getDataByFileId(this.fileId)
        : this.getAllOdsSpecialWholesales();
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
      this._odsSpecialWholesaleService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([odsSpecialWholesales]) => {
        console.log(`${this.TAG} > getData > odsSpecialWholesales`, odsSpecialWholesales);
        this.odsSpecialWholesales = odsSpecialWholesales.filter((o) => o.fileId === fileId);
        this.dataSource = new MatTableDataSource<any>(this.odsSpecialWholesales);
        this.sortAndPaginate();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`OdsSpecialWholesales > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  getAllOdsSpecialWholesales(): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this._odsSpecialWholesaleService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([odsSpecialWholesales]) => {
        console.log(`${this.TAG} > getData > odsSpecialWholesales`, odsSpecialWholesales);
        this.odsSpecialWholesales = odsSpecialWholesales;
        this.dataSource = new MatTableDataSource<any>(this.odsSpecialWholesales);
        this.sortAndPaginate();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`OdsSpecialWholesales > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('¡Ha ocurrido un error!', error, null, true);
      },
    });
  }

  sortAndPaginate() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sortingDataAccessor = (item, property) => {
    //   switch (property) {
    //     case 'yearMonth':
    //       return item.yearMonth;
    //     case 'vehicleType':
    //       return item.mercedesVehicleType;
    //     case 'category':
    //       return item.mercedesCategory;
    //     case 'exportMonthly':
    //       return item.exportMonthly;
    //     case 'savingSystemMonthly':
    //       return item.savingSystemMonthly;
    //     case 'noOkStock':
    //       return item.noOkStock;
    //     default:
    //       return item[property];
    //   }
    // };
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
      this.getDataByFileId(this.fileId);
      this.pageSize = 150;
      this.authService.onDrawerOpenedEmitter.emit(false);
      this.authService.onHeaderEmitter.emit(false);
    } else {
      this.fullScreen.isEnabled = false;
      this.getDataByFileId(this.fileId);
      this.pageSize = 5;
      this.authService.onDrawerOpenedEmitter.emit(true);
      this.authService.onHeaderEmitter.emit(true);
      if (screenfull.isFullscreen) screenfull.toggle();
    }
  }
}

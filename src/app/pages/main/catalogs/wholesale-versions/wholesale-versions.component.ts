import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Brand } from 'src/app/models/brands/brand.model';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { v4 as uuidv4 } from 'uuid';
import { PatentingVersion } from 'src/app/models/patenting-versions/patenting-version.model';
import { WholesaleVersion } from 'src/app/models/wholesale-versions/wholesale-version.model';
import { WholesaleVersionService } from 'src/app/services/wholesale-versions/wholesale-version.service';
import { WholesaleVersionsDialogComponent } from './wholesale-versions-dialog/wholesale-versions-dialog.component';
import { BrandService } from 'src/app/services/brands/brand.service';
import { CarModelService } from 'src/app/services/car-models/car-model.service';
import { TerminalService } from 'src/app/services/terminals/terminal.service';

@Component({
  selector: 'app-wholesale-versions',
  templateUrl: './wholesale-versions.component.html',
  styleUrls: ['./wholesale-versions.component.scss'],
})
export class WholeSalesVersionsComponent implements OnInit {
  TAG = WholeSalesVersionsComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  wholeSaleVersions: WholesaleVersion[] = [];
  brands: Brand[] = [];
  carModels: CarModel[] = [];
  terminals: Terminal[] = [];
  isXsOrSm = false;
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'version',
    'description',
    'mercedesTerminalId',
    'mercedesMarcaId',
    'mercedesModeloId',
    'terminal',
    'brand',
    'carModel',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private wholeSaleVersionService: WholesaleVersionService,
    private terminalService: TerminalService,
    private brandService: BrandService,
    private carModelService: CarModelService
  ) {
    this.unsubscribeAll = new Subject();
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
    this.getData();
    this.getCatalogs();
  }

  getData(): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this.wholeSaleVersionService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([wholeSaleVersions]) => {
        wholeSaleVersions.forEach((ws) => {
          ws.codName = `(${ws.version}) ${ws.description}`;
        });
        this.wholeSaleVersions = wholeSaleVersions;
        this.dataSource = new MatTableDataSource<any>(this.wholeSaleVersions);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`category > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  getCatalogs(): void {
    const $combineLatest = combineLatest([
      this.brandService.getAll(),
      this.carModelService.getAll(),
      this.terminalService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([brands, carModels, terminals]) => {
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
      },
      error: (err) => {
        console.error(`${this.TAG} > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createOrUpdate(wholeSaleVersionsComponent?: WholesaleVersion) {
    const dialogRef = this.dialog.open(WholesaleVersionsDialogComponent, {
      width: this.isXsOrSm ? '90%' : '60%',
      height: this.isXsOrSm ? '90%' : '60%',
      disableClose: true,
      data: {
        wholesaleVersion: wholeSaleVersionsComponent
          ? wholeSaleVersionsComponent
          : uuidv4(),
        terminals: this.terminals,
        brands: this.brands,
        carModels: this.carModels,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getData();
    });
  }

  confirmDelete(patentingVersionObject: PatentingVersion, callback?: any) {
    const internalVersion = `${patentingVersionObject.id ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar la versión interna "${internalVersion}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(patentingVersionObject.id ?? '');
      }
    );
  }

  delete(internalVersionId: string): void {
    this.wholeSaleVersionService.deleteCache(internalVersionId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Versión interna eliminada con éxito!',
        });
        this.getData();
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`${this.TAG} > delete > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

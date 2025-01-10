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
import { InternalVersion } from 'src/app/models/internal-versions/internal-version.model';
import { InternalVersionService } from 'src/app/services/internal-versions/internal-version.service';
import { InternalVersionDialogComponent } from './internal-version-dialog/internal-version-dialog.component';
import { Brand } from 'src/app/models/brands/brand.model';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { BrandService } from 'src/app/services/brands/brand.service';
import { CarModelService } from 'src/app/services/car-models/car-model.service';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import { v4 as uuidv4 } from 'uuid';
import { CatInternalVersion } from 'src/app/models/cat-internal-versions/cat-internal-versions.model';
import { CatInternalVersionService } from 'src/app/services/cat-internal-versions/cat-internal-versions.service';

@Component({
  selector: 'app-internal-versions',
  templateUrl: './internal-versions.component.html',
  styleUrls: ['./internal-versions.component.scss'],
})
export class InternalVersionsComponent implements OnInit {
  TAG = InternalVersionsComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  internalVersions: CatInternalVersion[] = [];
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
    'dateFrom',
    'dateTo',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private internalVersionService: CatInternalVersionService,
    private brandService: BrandService,
    private carModelService: CarModelService,
    private terminalService: TerminalService
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
  }

  getData(): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this.internalVersionService.getAll(),
      this.brandService.getAll(),
      this.carModelService.getAll(),
      this.terminalService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([internalVersions, brands, carModels, terminals]) => {
        console.log(
          `${this.TAG} > getData > internalVersions`,
          internalVersions
        );
        console.log(`${this.TAG} > getData > brands`, brands);
        console.log(`${this.TAG} > getData > carModels`, carModels);
        console.log(`${this.TAG} > getData > terminals`, terminals);
        internalVersions.forEach((iv) => {
          iv.codName = `(${iv.version}) ${iv.description}`;
        });
        this.internalVersions = internalVersions;
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
        this.dataSource = new MatTableDataSource<any>(this.internalVersions);
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

  createOrUpdate(internalVersionObject?: CatInternalVersion) {
    const dialogRef = this.dialog.open(InternalVersionDialogComponent, {
      width: this.isXsOrSm ? '90%' : '60%',
      height: this.isXsOrSm ? '90%' : '78%',
      disableClose: true,
      data: {
        catInternalVersion: internalVersionObject
          ? internalVersionObject
          : uuidv4(),
        brands: this.brands,
        carModels: this.carModels,
        terminals: this.terminals,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getData();
    });
  }

  confirmDelete(internalVersionObject: CatInternalVersion, callback?: any) {
    const internalVersion = `${internalVersionObject.id ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar la versión interna "${internalVersion}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(internalVersionObject.id ?? '');
      }
    );
  }

  delete(internalVersionId: string): void {
    this.internalVersionService.deleteCache(internalVersionId).subscribe({
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

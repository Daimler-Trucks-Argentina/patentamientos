import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import screenfull from 'screenfull';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Brand } from 'src/app/models/brands/brand.model';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { Ofmm } from 'src/app/models/ofmms/ofmm.model';
import { PatentingVersion } from 'src/app/models/patenting-versions/patenting-version.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BrandService } from 'src/app/services/brands/brand.service';
import { CarModelService } from 'src/app/services/car-models/car-model.service';
import { OfmmService } from 'src/app/services/ofmms/ofmm.service';
import { PatentingVersionService } from 'src/app/services/patenting-versions/patenting-version.service';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import { v4 as uuidv4 } from 'uuid';
import { OfmmDialogComponent } from './ofmm-dialog/ofmm-dialog.component';
import { UpdateOfmmsDialogComponent } from './update-ofmms-dialog/update-ofmms.component';

@Component({
  selector: 'app-ofmms',
  templateUrl: './ofmms.component.html',
  styleUrls: ['./ofmms.component.scss'],
})
export class OfmmsComponent implements OnInit {
  TAG = OfmmsComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  ofmm: Ofmm[] = [];
  brands: Brand[] = [];
  carModels: CarModel[] = [];
  terminals: Terminal[] = [];
  fullScreen = { isEnabled: false, isFullscreen: false };
  patentings: PatentingVersion[] = [];
  pageSize: number = 8;
  isXsOrSm = false;
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'acciones',
    'ZOFMM',
    'ValidoDesde',
    'ValidoHasta',
    'FabricaPat',
    'MarcaPat',
    'MODELOPAT',
    'Descripcion1',
    'Descripcion2',
    'TipoDeTexto',
    'Terminal',
    'Marca',
    'Modelo',
    'VersionPatentamiento',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private ofmmService: OfmmService,
    private brandService: BrandService,
    private carModelService: CarModelService,
    private terminalService: TerminalService,
    private patentingService: PatentingVersionService,
    private authService: AuthService
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
    const $combineLatest = combineLatest([this.ofmmService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([ofmm]) => {
        console.log(`${this.TAG} > getData > ofmm`, ofmm);
        this.ofmm = ofmm;
        this.dataSource = new MatTableDataSource<any>(this.ofmm);
        this.dataSource.paginator = this.paginator;
        this.sortAndPaginate();
        this.dataSource.filterPredicate = function (
          data,
          filter: string
        ): boolean {
          return (
            data.zofmm.toLowerCase().includes(filter) ||
            data.validoDesde.toLowerCase().includes(filter) ||
            data.validoHasta.toLowerCase().includes(filter) ||
            data.fabricaPat.toLowerCase().includes(filter) ||
            data.marcaPat.toLowerCase().includes(filter) ||
            data.modelopat.toLowerCase().includes(filter) ||
            data.descripcion1.toLowerCase().includes(filter) ||
            data.descripcion2.toLowerCase().includes(filter) ||
            data.tipoDeTexto.toLowerCase().includes(filter) ||
            data.terminal.toLowerCase().includes(filter) ||
            data.marca.toLowerCase().includes(filter) ||
            data.modelo.toLowerCase().includes(filter) ||
            data.versionPatentamiento.toLowerCase().includes(filter)
          );
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`Ofmm > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  sortAndPaginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'terminal_id':
          return item.terminal.mercedesTerminalId;
        case 'terminal_name':
          return item.terminal.name;
        default:
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
  }

  getCatalogs(): void {
    const $combineLatest = combineLatest([
      this.brandService.getAll(),
      this.carModelService.getAll(),
      this.carModelService.getNoAssigned(),
      this.terminalService.getAll(),
      this.patentingService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([
        brands,
        carModels,
        noAssignedCarModel,
        terminals,
        patentings,
      ]) => {
        console.log(`${this.TAG} > getData > brands`, brands);
        console.log(`${this.TAG} > getData > carModels`, carModels);
        console.log(`${this.TAG} > getData > terminals`, terminals);
        console.log(`${this.TAG} > getData > patentings`, patentings);
        brands.forEach((b) => {
          b.codName = `(${b.mercedesMarcaId}) ${b.name}`;
        });
        this.brands = brands;
        carModels.push(noAssignedCarModel);
        carModels.forEach((cm) => {
          cm.codName = `(${cm.mercedesModeloId}) ${cm.name}`;
        });
        this.carModels = carModels;
        terminals.forEach((t) => {
          t.codName = `(${t.mercedesTerminalId}) ${t.name}`;
        });
        this.terminals = terminals;
        patentings.forEach((p) => {
          p.codName = `(${p.version}) ${p.description}`;
        });
        this.patentings = patentings;
      },
      error: (err) => {
        console.error(`${this.TAG} > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createOrUpdate(ofmmObject?: Ofmm) {
    const dialogRef = this.dialog.open(OfmmDialogComponent, {
      width: this.isXsOrSm ? '90%' : '60%',
      height: this.isXsOrSm ? '90%' : '70%',
      disableClose: true,
      data: {
        ofmm: ofmmObject ? ofmmObject : uuidv4(),
        brands: this.brands,
        terminals: this.terminals,
        carModels: this.carModels,
        patentingVersions: this.patentings,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getData();
    });
  }

  updateOfmm(ofmmObject?: Ofmm) {
    const ofmms = this.ofmm.filter((o) => ofmmObject?.zofmm === o.zofmm);
    const dialogRef = this.dialog.open(UpdateOfmmsDialogComponent, {
      width: this.isXsOrSm ? '90%' : '100%',
      height: this.isXsOrSm ? '90%' : 'auto',
      disableClose: true,
      data: {
        ofmms: ofmms,
        brands: this.brands,
        terminals: this.terminals,
        carModels: this.carModels,
        patentingVersions: this.patentings,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getData();
    });
  }

  confirmDelete(ofmmObject: Ofmm, callback?: any) {
    const ofmm = `${ofmmObject.id ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar la OFMM "${ofmm}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(ofmmObject.id ?? '');
      }
    );
  }

  delete(ofmmId: string): void {
    this.ofmmService.deleteCache(ofmmId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡OFMM eliminado con éxito!',
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
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filterPredicate = (data: any): boolean => {
      const searchTerms = filterValue.split(' ');
      return searchTerms.every((term) => {
        const lowerCaseTerm = term.toLowerCase();
        return [
          data.zofmm?.toLowerCase().includes(lowerCaseTerm),
          data.validoDesde?.toLowerCase().includes(lowerCaseTerm),
          data.validoHasta?.toLowerCase().includes(lowerCaseTerm),
          data.fabricaPat?.toLowerCase().includes(lowerCaseTerm),
          data.marcaPat?.toLowerCase().includes(lowerCaseTerm),
          data.modelopat?.toLowerCase().includes(lowerCaseTerm),
          data.descripcion1?.toLowerCase().includes(lowerCaseTerm),
          data.descripcion2?.toLowerCase().includes(lowerCaseTerm),
          data.tipoDeTexto?.toLowerCase().includes(lowerCaseTerm),
          data.terminal?.toLowerCase().includes(lowerCaseTerm),
          data.marca?.toLowerCase().includes(lowerCaseTerm),
          data.modelo?.toLowerCase().includes(lowerCaseTerm),
          data.versionPatentamiento?.toLowerCase().includes(lowerCaseTerm),
        ].some((fieldMatch) => fieldMatch);
      });
    };

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleFullscreen() {
    console.log(screenfull);

    if (!this.fullScreen.isEnabled) {
      this.fullScreen.isEnabled = true;
      if (!screenfull.isFullscreen) screenfull.toggle();
      this.getData();
      this.pageSize = 150;
      this.authService.onDrawerOpenedEmitter.emit(false);
      this.authService.onHeaderEmitter.emit(false);
    } else {
      this.fullScreen.isEnabled = false;
      this.getData();
      this.pageSize = 8;
      this.authService.onDrawerOpenedEmitter.emit(true);
      this.authService.onHeaderEmitter.emit(true);
      if (screenfull.isFullscreen) screenfull.toggle();
    }
  }
}

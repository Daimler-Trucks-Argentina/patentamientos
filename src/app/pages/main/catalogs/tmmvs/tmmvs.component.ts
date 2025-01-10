import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Tmmv } from 'src/app/models/tmmvs/tmmv.model';
import { TmmvService } from 'src/app/services/tmmvs/tmmv.service';
import { v4 as uuidv4 } from 'uuid';
import { TmmvDialogComponent } from './tmmv-dialog/tmmv-dialog.component';
import { BrandService } from 'src/app/services/brands/brand.service';
import { CarModelService } from 'src/app/services/car-models/car-model.service';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import { Brand } from 'src/app/models/brands/brand.model';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { InternalVersionService } from 'src/app/services/internal-versions/internal-version.service';
import { InternalVersion } from 'src/app/models/internal-versions/internal-version.model';
import screenfull from 'screenfull';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSort } from '@angular/material/sort';
import { WholesaleVersion } from 'src/app/models/wholesale-versions/wholesale-version.model';
import { PatentingVersion } from 'src/app/models/patenting-versions/patenting-version.model';
import { PatentingVersionService } from 'src/app/services/patenting-versions/patenting-version.service';
import { WholesaleVersionService } from 'src/app/services/wholesale-versions/wholesale-version.service';
import { CatInternalVersionService } from 'src/app/services/cat-internal-versions/cat-internal-versions.service';
import { CatInternalVersion } from 'src/app/models/cat-internal-versions/cat-internal-versions.model';

@Component({
  selector: 'app-tmmvs',
  templateUrl: './tmmvs.component.html',
  styleUrls: ['./tmmvs.component.scss'],
})
export class TmmvsComponent implements OnInit {
  TAG = TmmvsComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  tmmv: Tmmv[] = [];
  brands: Brand[] = [];
  terminals: Terminal[] = [];
  carModels: CarModel[] = [];
  internalVersions: InternalVersion[] = [];
  wholesaleVersions: WholesaleVersion[] = [];
  patentingVersions: PatentingVersion[] = [];
  catInternalVersions: CatInternalVersion[] = [];
  isXsOrSm = false;
  isLoading = true;
  fullScreen = {
    isEnabled: false,
    isFullscreen: false,
  };
  pageSize: number = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'zTerminal',
    'descripcionTerminal',
    'zMarca',
    'descripcionMarca',
    'zModelo',
    'descripcionModelo',
    'versionPatentamiento',
    'descripcionVerPat',
    'versionWs',
    'descripcionVerWs',
    'versionInterna',
    'descripcionVerInt',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private router: Router,
    private tmmvService: TmmvService,
    private brandService: BrandService,
    private terminalService: TerminalService,
    private carModelsService: CarModelService,
    private internalVersionService: InternalVersionService,
    private patentingVersionService: PatentingVersionService,
    private wholesaleVersionService: WholesaleVersionService,
    private catInternalVersionService: CatInternalVersionService,
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
    const $combineLatest = combineLatest([this.tmmvService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([tmmv]) => {
        console.log(`${this.TAG} > getData > tmmv`, tmmv);
        this.tmmv = tmmv;
        this.dataSource = new MatTableDataSource<any>(this.tmmv);
        this.sortAndPaginate();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`Tmmv > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  sortAndPaginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCatalogs() {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this.brandService.getAll(),
      this.carModelsService.getAll(),
      this.carModelsService.getNoAssigned(),
      this.terminalService.getAll(),
      this.internalVersionService.getAll(),
      this.patentingVersionService.getAll(),
      this.wholesaleVersionService.getAll(),
      this.catInternalVersionService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([
        brands,
        carModels,
        noAssignedCarModel,
        terminals,
        internalVersions,
        patentingVersions,
        wholesaleVersions,
        catInternalVersions,
      ]) => {
        console.log(`${this.TAG} > getData > brands`, brands);
        console.log(`${this.TAG} > getData > carModels`, carModels);
        console.log(`${this.TAG} > getData > terminals`, terminals);
        console.log(
          `${this.TAG} > getData > internalVersions`,
          internalVersions
        );
        console.log(
          `${this.TAG} > getData > patentingVersions`,
          patentingVersions
        );
        console.log(
          `${this.TAG} > getData > wholesaleVersions`,
          wholesaleVersions
        );
        console.log(
          `${this.TAG} > getData > catInternalVersions`,
          catInternalVersions
        );
        brands.forEach((b) => {
          b.codName = `(${b.mercedesMarcaId}) ${b.name}`;
        });
        carModels.push(noAssignedCarModel);
        carModels.forEach((cm) => {
          cm.codName = `(${cm.mercedesModeloId}) ${cm.name}`;
        });
        terminals.forEach((t) => {
          t.codName = `(${t.mercedesTerminalId}) ${t.name}`;
        });
        const intVer: InternalVersion[] = [];
        internalVersions.forEach((iv) => {
          if (
            iv.versionInterna &&
            iv.descripcionVerInt &&
            new Date(iv.dateTo!) >= new Date()
          ) {
            iv.codName = `${'(' + iv.versionInterna + ') '} ${
              iv.descripcionVerInt
            }`; //`(${iv.versionInterna+'-'+iv.versionWs+''+iv.versionPatentamiento}) ${iv.descripcionVerInt}`;
            intVer.push(iv);
          }
        });
        const patVer: PatentingVersion[] = [];
        patentingVersions.forEach((pv) => {
          if (pv.version && pv.description) {
            pv.codName = `(${pv.version}) ${pv.description}`;
            patVer.push(pv);
          }
        });
        const whoVer: WholesaleVersion[] = [];
        wholesaleVersions.forEach((wv) => {
          if (wv.version && wv.description) {
            wv.codName = `(${wv.version}) ${wv.description}`;
            whoVer.push(wv);
          }
        });
        const catIntVer: CatInternalVersion[] = [];
        catInternalVersions.forEach((civ) => {
          if (civ.version && civ.description) {
            civ.codName = `(${civ.version}) ${civ.description}`;
            catIntVer.push(civ);
          }
        });
        this.brands = brands;
        this.carModels = carModels;
        this.terminals = terminals;
        this.internalVersions = intVer;
        this.patentingVersions = patVer;
        this.wholesaleVersions = whoVer;
        this.catInternalVersions = catIntVer;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`${this.TAG} > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createOrUpdate(tmmvObject?: Tmmv) {
    const dialogRef = this.dialog.open(TmmvDialogComponent, {
      width: this.isXsOrSm ? '90%' : '50%',
      height: this.isXsOrSm ? '90%' : '60%',
      disableClose: true,
      data: {
        tmmv: tmmvObject ? tmmvObject : uuidv4(),
        brands: this.brands,
        terminals: this.terminals,
        carModels: this.carModels,
        patentingVersions: this.patentingVersions,
        wholesaleVersions: this.wholesaleVersions,
        catInternalVersions: this.catInternalVersions,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getData();
    });
  }

  confirmDelete(tmmvObject: Tmmv, callback?: any) {
    const tmmv = `${tmmvObject.id ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar la TMMV "${tmmv}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(tmmvObject.id ?? '');
      }
    );
  }

  delete(tmmvId: string): void {
    this.tmmvService.deleteCache(tmmvId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡TMMV eliminado con éxito!',
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
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); 
    this.dataSource.filterPredicate = (data: any): boolean => {
      const searchTerms = filterValue.split(' ');  
      return searchTerms.every(term => {
        const lowerCaseTerm = term.toLowerCase();
        return [
          data.descripcionMarca?.toLowerCase().includes(lowerCaseTerm),
          data.descripcionModelo?.toLowerCase().includes(lowerCaseTerm),
          data.descripcionTerminal?.toLowerCase().includes(lowerCaseTerm),
          data.descripcionVerInt?.toLowerCase().includes(lowerCaseTerm),
          data.descripcionVerPat?.toLowerCase().includes(lowerCaseTerm),
          data.descripcionVerWs?.toLowerCase().includes(lowerCaseTerm),
          data.mercedesMarcaId?.toLowerCase().includes(lowerCaseTerm),
          data.mercedesModeloId?.toLowerCase().includes(lowerCaseTerm),
          data.mercedesTerminalId?.toLowerCase().includes(lowerCaseTerm),
          data.versionInterna?.toLowerCase().includes(lowerCaseTerm),
          data.versionPatentamiento?.toLowerCase().includes(lowerCaseTerm),
          data.versionWs?.toLowerCase().includes(lowerCaseTerm)
        ].some(fieldMatch => fieldMatch);  
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
      this.pageSize = 10;
      this.authService.onDrawerOpenedEmitter.emit(true);
      this.authService.onHeaderEmitter.emit(true);
      if (screenfull.isFullscreen) screenfull.toggle();
    }
  }
}

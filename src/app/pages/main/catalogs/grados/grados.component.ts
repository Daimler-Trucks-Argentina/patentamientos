import { BreakpointObserver, Breakpoints, BreakpointState, } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Grado } from 'src/app/models/grados/grado.model';
import { BrandService } from 'src/app/services/brands/brand.service';
import { CarModelService } from 'src/app/services/car-models/car-model.service';
import { GradoService } from 'src/app/services/grados/grado.service';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import { v4 } from 'uuid';
import { GradoDialogComponent } from './grado-dialog/grado-dialog.component';
import { MatSort } from '@angular/material/sort';
import { WholesaleVersionService } from 'src/app/services/wholesale-versions/wholesale-version.service';

@Component({
  selector: 'app-grados',
  templateUrl: './grados.component.html',
  styleUrls: ['./grados.component.scss'],
})
export class GradosComponent {
  TAG = GradosComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  grados: Grado[] = [];
  isXsOrSm = false;
  isLoading = true;
  pageSize: number = 8;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'marcaWs',
    'modeloWs',
    'grade',
    'dateFrom',
    'dateTo',
    'mercedesTerminalId',
    'mercedesMarcaId',
    'mercedesModeloId',
    'versionWs',
    'dischargeDate',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private gradoService: GradoService,
    private terminalService: TerminalService,
    private brandService: BrandService,
    private carModelService: CarModelService,
    private wholesaleVersionService: WholesaleVersionService,
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
    const $combineLatest = combineLatest([this.gradoService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([grados]) => {
        console.log(`${this.TAG} > getData > grados`, grados);
        this.grados = grados;
        this.dataSource = new MatTableDataSource<any>(this.grados);
        this.dataSource.paginator = this.paginator;
        this.sortAndPaginate();
        this.dataSource.filterPredicate = (data, filter: string): boolean => {
          return (
            (data.marcaWs && data.marcaWs.toLowerCase().includes(filter)) ||
            (data.modeloWs && data.modeloWs.toLowerCase().includes(filter)) ||
            (data.grade && data.grade.toLowerCase().includes(filter)) ||
            (data.dateFrom && data.dateFrom.toLowerCase().includes(filter)) ||
            (data.dateTo && data.dateTo.toLowerCase().includes(filter)) ||
            (data.mercedesTerminalId && data.mercedesTerminalId.toLowerCase().includes(filter)) ||
            (data.mercedesMarcaId && data.mercedesMarcaId.toLowerCase().includes(filter)) ||
            (data.mercedesModeloId && data.mercedesModeloId.toLowerCase().includes(filter)) ||
            (data.versionWs && data.versionWs.toLowerCase().includes(filter)) ||
            (data.dischargeDate && data.dischargeDate.toLowerCase().includes(filter))
          );
        };
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

  getCatalogs() { }

  createOrUpdate(gradoObject?: Grado) {
    this.isLoading = true;
    const $combineLatest = combineLatest([this.terminalService.getAll(), this.brandService.getAll(), this.carModelService.getAll(), this.wholesaleVersionService.getAll()  ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([terminals, brands, carModels,wholesaleversions]) => {
        console.log(`${this.TAG} > getData > terminals`, terminals);
        console.log(`${this.TAG} > getData > brands`, brands);
        console.log(`${this.TAG} > getData > carModels`, carModels);        
        console.log(`${this.TAG} > getData > wholesaleversions`, wholesaleversions);
        terminals.forEach((t) => { t.codName = `(${t.mercedesTerminalId}) ${t.name}`; });
        brands.forEach((b) => { b.codName = `(${b.mercedesMarcaId}) ${b.name}`; });
        carModels.forEach((cm) => { cm.codName = `(${cm.mercedesModeloId}) ${cm.name}`;});
        wholesaleversions.forEach((wsv) => { wsv.codName = `(${wsv.version}) ${wsv.description}`; });
        this.isLoading = false;
        const dialogRef = this.dialog.open(GradoDialogComponent, {
          width: this.isXsOrSm ? '90%' : '65%',
          height: this.isXsOrSm ? '90%' : '60%',
          disableClose: true,
          data: {
            grado: gradoObject ? gradoObject : v4(),
            terminals: terminals,
            brands: brands,
            carModels: carModels,
            versions: wholesaleversions
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getData();
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

  confirmDelete(gradoObject: Grado, callback?: any) {
    const grado = `${gradoObject.id ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar el grado "${grado}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(gradoObject.id ?? '');
      }
    );
  }

  delete(gradoId: string): void {
    this.gradoService.deleteCache(gradoId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Grado eliminado con éxito!',
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
          data.marcaWs?.toLowerCase().includes(lowerCaseTerm),
          data.modeloWs?.toLowerCase().includes(lowerCaseTerm),
          data.grade?.toLowerCase().includes(lowerCaseTerm),
          data.dateFrom?.toLowerCase().includes(lowerCaseTerm),
          data.dateTo?.toLowerCase().includes(lowerCaseTerm),
          data.mercedesTerminalId?.toLowerCase().includes(lowerCaseTerm),
          data.mercedesMarcaId?.toLowerCase().includes(lowerCaseTerm),
          data.mercedesModeloId?.toLowerCase().includes(lowerCaseTerm),
          data.versionWs?.toLowerCase().includes(lowerCaseTerm),
          data.dischargeDate?.toLowerCase().includes(lowerCaseTerm)
        ].some(fieldMatch => fieldMatch);  
      });
    };
  
    this.dataSource.filter = filterValue;  
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

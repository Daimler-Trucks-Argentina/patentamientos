import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { CarModelService } from 'src/app/services/car-models/car-model.service';
import { v4 as uuidv4 } from 'uuid';
import { CarModelDialogComponent } from './car-model-dialog/car-model-dialog.component';
import { Brand } from 'src/app/models/brands/brand.model';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { BrandService } from 'src/app/services/brands/brand.service';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-car-models',
  templateUrl: './car-models.component.html',
  styleUrls: ['./car-models.component.scss'],
})
export class CarModelsComponent {
  TAG = CarModelsComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  carModels: CarModel[] = [];
  brands: Brand[] = [];
  terminals: Terminal[] = [];
  isXsOrSm = false;
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'terminal_id',
    'terminal_description',
    'brand_id',
    'brand_description',
    'id',
    'description',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private router: Router,
    private carModelService: CarModelService,
    private brandService: BrandService,
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
      this.carModelService.getAll(),
      this.brandService.getAll(),
      this.terminalService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([carModels, brands, terminals]) => {
        console.log(`${this.TAG} > getData > carModels`, carModels);
        console.log(`${this.TAG} > getData > brands`, brands);
        console.log(`${this.TAG} > getData > terminals`, terminals);
        terminals.forEach((t) => {
          t.codName = `(${t.mercedesTerminalId}) ${t.name}`;
        });
        brands.forEach((b) => {
          b.codName = `(${b.mercedesMarcaId}) ${b.name}`;
        });
        carModels.forEach((cm) => {
          cm.codName = `(${cm.mercedesModeloId}) ${cm.name}`;
        });
        this.terminals = terminals;
        this.brands = brands;
        this.carModels = carModels;
        this.dataSource = new MatTableDataSource<any>(this.carModels);
        this.sortAndPaginate();
        this.dataSource.filterPredicate = function (
          data,
          filter: string
        ): boolean {
          return (
            data.brand.terminal.description.toLowerCase().includes(filter) || 
            data.brand.mercedesTerminalId.toLowerCase().includes(filter) ||
            data.brand.mercedesMarcaId.toLowerCase().includes(filter) ||
            data.brand.description.toLowerCase().includes(filter) ||
            data.mercedesModeloId.toLowerCase().includes(filter) ||
            data.description.toLowerCase().includes(filter)
          );
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`carModels > getData > error`, err);
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
          return item.brand.terminal.mercedesTerminalId;
        case 'terminal_description':
          return item.brand.terminal.description;
        case 'brand_id':
          return item.brand.mercedesMarcaId;
        case 'brand_description':
          return item.brand.description;
        default:
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
  }

  createOrUpdate(carModelObject?: CarModel) {
    const dialogRef = this.dialog.open(CarModelDialogComponent, {
      width: this.isXsOrSm ? '90%' : '30%',
      height: this.isXsOrSm ? '80%' : carModelObject?.id ? '50%' : '75%',
      disableClose: true,
      data: {
        carModel: carModelObject ? carModelObject : uuidv4(),
        carModels: this.carModels,
        terminals: this.terminals,
        brands: this.brands,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  confirmDelete(carModelObject: CarModel, callback?: any) {
    const carModel = `${carModelObject.name ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar el modelo "${carModel}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(carModelObject.id ?? '');
      }
    );
  }

  delete(carModelId: string): void {
    this.carModelService.deleteCache(carModelId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Modelo eliminado con éxito!',
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
          data.mercedesTerminalId?.toLowerCase().includes(lowerCaseTerm),
          data.brand.terminal.description?.toLowerCase().includes(lowerCaseTerm),
          data.mercedesMarcaId?.toLowerCase().includes(lowerCaseTerm),
          data.brand.description?.toLowerCase().includes(lowerCaseTerm),
          data.mercedesModeloId?.toLowerCase().includes(lowerCaseTerm),
          data.description?.toLowerCase().includes(lowerCaseTerm)
        ].some(fieldMatch => fieldMatch);  
      });
    };
  
    this.dataSource.filter = filterValue;  
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

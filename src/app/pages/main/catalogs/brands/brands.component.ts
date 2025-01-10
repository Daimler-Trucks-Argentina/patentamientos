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
import { Brand } from 'src/app/models/brands/brand.model';
import { BrandService } from 'src/app/services/brands/brand.service';
import { v4 as uuidv4 } from 'uuid';
import { BrandDialogComponent } from './brand-dialog/brand-dialog.component';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit {
  TAG = BrandsComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  brands: Brand[] = [];
  terminals: Terminal[] = [];
  isXsOrSm = false;
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'terminal_id',
    'terminal_name',
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
      this.brandService.getAll(),
      this.terminalService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([brands, terminals]) => {
        console.log(`${this.TAG} > getData > brands`, brands);
        console.log(`${this.TAG} > getData > terminals`, terminals);
        brands.forEach((b) => {
          b.codName = `(${b.mercedesMarcaId}) ${b.name}`;
        });
        terminals.forEach((t) => {
          t.codName = `(${t.mercedesTerminalId}) ${t.name}`;
        });
        this.terminals = terminals;
        this.brands = brands;
        this.dataSource = new MatTableDataSource<any>(this.brands);
        this.sortAndPaginate();
        this.dataSource.filterPredicate = function (
          data,
          filter: string
        ): boolean {
          return (
            data.mercedesMarcaId.toLowerCase().includes(filter) ||
            data.description.toLowerCase().includes(filter) || 
            data.terminal.description.toLowerCase().includes(filter) || 
            data.mercedesTerminalId.toLowerCase().includes(filter)
          );
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`Brands > getData > error`, err);
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

  createOrUpdate(brandObject?: Brand) {
    const dialogRef = this.dialog.open(BrandDialogComponent, {
      width: this.isXsOrSm ? '90%' : '30%',
      height: this.isXsOrSm ? '80%' : '70%',
      disableClose: true,
      data: {
        brand: brandObject ? brandObject : uuidv4(),
        terminals: this.terminals,
        brands: this.brands,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  confirmDelete(brandObject: Brand, callback?: any) {
    const brand = `${brandObject.name ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar la marca "${brand}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(brandObject.id ?? '');
      }
    );
  }

  delete(brandId: string): void {
    this.brandService.deleteCache(brandId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Marca eliminada con éxito!',
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
          data.terminal.mercedesTerminalId?.toLowerCase().includes(lowerCaseTerm),
          data.terminal.description?.toLowerCase().includes(lowerCaseTerm),
          data.mercedesMarcaId?.toLowerCase().includes(lowerCaseTerm),
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

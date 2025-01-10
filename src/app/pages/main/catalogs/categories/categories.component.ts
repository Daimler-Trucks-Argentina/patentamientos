import {  BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Category } from 'src/app/models/categories/category.model';
import { CategoryService } from 'src/app/services/categories/category.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  TAG = CategoriesComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  categories: Category[] = [];
  isXsOrSm = false;
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['segCategory', 'description', 'acciones'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private categoryService: CategoryService
  ) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((state: BreakpointState) => {
        console.log(`${this.TAG} > ngOnInit > breakpointObserver > state`,state);
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
    const $combineLatest = combineLatest([this.categoryService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([categories]) => {
        console.log(`${this.TAG} > getData > categories`, categories);
        this.categories = categories;
        this.dataSource = new MatTableDataSource<any>(this.categories);
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

  createOrUpdate(categoryObject?: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: this.isXsOrSm ? '90%' : '30%',
      height: this.isXsOrSm ? '80%' : '50%',
      disableClose: true,
      data: {
        category: categoryObject ? categoryObject : uuidv4(),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  confirmDelete(categoryObject: Category, callback?: any) {
    const category = `${categoryObject.id ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar la categoría "${category}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(categoryObject.id ?? '');
      }
    );
  }

  delete(categoryId: string): void {
    this.categoryService.deleteCache(categoryId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Categoría eliminada con éxito!',
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
          data.segCategory?.toLowerCase().includes(lowerCaseTerm),
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

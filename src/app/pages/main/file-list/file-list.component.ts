import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileListDialogComponent } from './file-list-dialog/file-list-dialog.component';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { File } from 'src/app/models/files/file.model';
import { FileService } from 'src/app/services/files/file.service';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { v4 as uuidv4 } from 'uuid';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FileListViewDialogComponent } from './file-list-view-dialog/file-list-view-dialog.component';
import { ClosureService } from 'src/app/services/closures/closure.service';
import { Closure } from 'src/app/models/closures/closure.model';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit {
  TAG = FileListComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  files: File[] = [];
  closures: Closure[] = [];
  closure: Closure = new Closure();
  types = {
    daily: '00000000-0000-0000-0000-000000000010',
    wholesale: '00000000-0000-0000-0000-000000000020',
    monthly: '00000000-0000-0000-0000-000000000030',
    specialWholesale: '00000000-0000-0000-0000-000000000040',
    historical: '00000000-0000-0000-0000-000000000050',
  };
  isXsOrSm = false;
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'archivo',
    'estado',
    'cantidad_registros',
    // 'fecha_corte',
    'fecha_carga',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private fileService: FileService,
    private closureService: ClosureService,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private router: Router
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
      this.fileService.getAll(),
      this.closureService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([files, closures]) => {
        console.log(`${this.TAG} > getData > files`, files);
        console.log(`${this.TAG} > getData > closures`, closures);
        this.files = files;
        this.closures = closures;
        const lastClosure = this.closures.find((c) => c.esUltimo == true);
        this.closure = lastClosure!;
        this.dataSource = new MatTableDataSource<any>(this.files);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`FileListDialog > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createOrUpdate(fileObject?: File) {
    const dialogRef = this.dialog.open(FileListDialogComponent, {
      width: this.isXsOrSm ? '90%' : '30%',
      height: this.isXsOrSm ? '75%' : '55%',
      disableClose: true,
      data: {
        file: fileObject ? fileObject : uuidv4(),
        files: this.files,
        closure: this.closure,
        closures: this.closures,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
      if (result) {
        if (
          result.fileTypeID === this.types.daily ||
          result.fileTypeID === this.types.monthly
        ) {
          //this.processPat(result);
        }
      }
    });
  }

  viewCSV(fileObject: File) {
    const dialogRef = this.dialog.open(FileListViewDialogComponent, {
      width: this.isXsOrSm ? '90%' : '80%',
      height: this.isXsOrSm ? '90%' : 'auto',
      disableClose: true,
      data: {
        file: fileObject ? fileObject : uuidv4(),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  download(fileObject: File) {
    window.location.href = fileObject.url;
  }

  confirmDelete(fileObject: File, callback?: any) {
    const file = `${fileObject.name ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar el archivo "${file}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(fileObject.id ?? '');
      }
    );
  }

  delete(fileId: string): void {
    this.fileService.deleteFile(fileId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Archivo eliminado con éxito!',
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

  processPat(fileObject: File) {
    if (fileObject.status == 'Procesado') {
      fileObject.fileTypeID == this.types.wholesale ||
      fileObject.fileTypeID == this.types.specialWholesale
        ? this.viewWholesaleErrors(fileObject)
        : this.viewErrors(fileObject);
    } else {
      //TODO process
      this.isLoading = true;
      const $combineLatest = combineLatest([
        this.fileService.processByFileId(
          fileObject.id!,
          fileObject.fileTypeID,
          ''
        ),
      ]);
      $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
        next: ([response]) => {
          console.log(`${this.TAG} > processByFileId > response`, response);
          this.isLoading = false;
          Toast.fire({
            icon: 'success',
            title: '¡Archivo procesado con éxito!',
          });
          this.getData();
          //TODO Redirecciona
        },
        error: (err) => {
          this.isLoading = false;
          console.error(`processByFileId > response > error`, err);
          const error = ErrorHelper.getErrorMessage(err);
          this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        },
      });
    }
  }

  viewErrors(fileObject: File) {
    console.log('Objeto', fileObject);
    this.router.navigate(['pages/main/patenting'], {
      queryParams: {
        fileId: fileObject.id,
      },
    });
  }

  viewWholesaleErrors(fileObject: File) {
    console.log('Objeto', fileObject);
    if (fileObject.fileTypeID == this.types.wholesale) {
      this.router.navigate(['pages/main/sales-process'], {
        queryParams: {
          fileId: fileObject.id,
        },
      });
    } else {
      this.router.navigate(['pages/main/special-sales-process'], {
        queryParams: {
          fileId: fileObject.id,
        },
      });
    }
  }

  viewSegmentation(fileObject: File) {
    console.log('Objeto', fileObject);
    this.router.navigate(['pages/main/segmentation-process'], {
      queryParams: {
        fileId: fileObject.id,
      },
    });
  }
}

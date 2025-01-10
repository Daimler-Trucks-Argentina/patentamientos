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
import { InternalVersionSegmentation } from 'src/app/models/internal-version-segmentations/internal-version-segmentation.model';
import { KeyVersion } from 'src/app/models/key-versions/key-version.model';
import { InternalVersionSegmentationService } from 'src/app/services/internal-version-segmentations/internal-version-segmentation.service';
import { KeyVersionService } from 'src/app/services/key-versions/key-version.service';
import { KeyVersionDialogComponent } from './key-version-dialog/key-version-dialog.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-key-versions',
  templateUrl: './key-versions.component.html',
  styleUrls: ['./key-versions.component.scss'],
})
export class KeyVersionsComponent implements OnInit {
  TAG = KeyVersionsComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  keyVersions: KeyVersion[] = [];
  internalVersionSegmentations: InternalVersionSegmentation[] = [];
  isXsOrSm = false;
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'mVersionClaveId', // MercedesVersionClaveId
    'mTerminalId', // MercedesTerminalId
    'mMarcaId', // MercedesMarcaId
    'mModeloId', // MercedesModeloId
    'mVersionInternaSegmentacionId', // MercedesVersionInternaSegmentacionId
    'dateTo',
    'dateFrom',
    'descriptionShort', // Descripción breve
    'descriptionLong', // Descripción larga
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private keyVersionService: KeyVersionService,
    private internalVersionSegmentationService: InternalVersionSegmentationService
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
      this.keyVersionService.getAll(),
      this.internalVersionSegmentationService.getAll(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([keyVersions, internalVersionSegmentations]) => {
        console.log(`${this.TAG} > getData > keyVersions`, keyVersions);
        console.log(
          `${this.TAG} > getData > internalVersionSegmentations`,
          internalVersionSegmentations
        );
        this.internalVersionSegmentations = internalVersionSegmentations;
        this.keyVersions = keyVersions;
        this.dataSource = new MatTableDataSource<any>(this.keyVersions);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`KeyVersion > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createOrUpdate(keyVersionObject?: KeyVersion) {
    const dialogRef = this.dialog.open(KeyVersionDialogComponent, {
      width: this.isXsOrSm ? '90%' : '50%',
      height: this.isXsOrSm ? '90%' : '75%',
      disableClose: true,
      data: {
        keyVersion: keyVersionObject ? keyVersionObject : uuidv4(),
        internalVersionSegmentations: this.internalVersionSegmentations,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  confirmDelete(keyVersionObject: KeyVersion, callback?: any) {
    const keyVersion = `${keyVersionObject.id ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar la versión clave "${keyVersion}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(keyVersionObject.id ?? '');
      }
    );
  }

  delete(keyVersionId: string): void {
    this.keyVersionService.deleteCache(keyVersionId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Versión clave eliminado con éxito!',
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

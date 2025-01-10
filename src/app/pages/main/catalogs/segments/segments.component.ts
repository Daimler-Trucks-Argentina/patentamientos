import { BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Segment } from 'src/app/models/segments/segment.model';
import { SegmentService } from 'src/app/services/segments/segment.service';
import { v4 as uuidv4 } from 'uuid';
import { SegmentDialogComponent } from './segment-dialog/segment-dialog.component';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss'],
})
export class SegmentsComponent implements OnInit {
  TAG = SegmentsComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  segments: Segment[] = [];
  isXsOrSm = false;
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'mercedesCategoriaId',
    'segName',
    'descriptionLong',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private segmentService: SegmentService
  ) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((state: BreakpointState) => {
        console.log( `${this.TAG} > ngOnInit > breakpointObserver > state`, state );
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
    const $combineLatest = combineLatest([this.segmentService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([segments]) => {
        console.log(`${this.TAG} > getData > segments`, segments);
        this.segments = segments;
        this.dataSource = new MatTableDataSource<any>(this.segments);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`segment > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createOrUpdate(segmentObject?: Segment) {
    const dialogRef = this.dialog.open(SegmentDialogComponent, {
      width: this.isXsOrSm ? '90%' : '40%',
      height: this.isXsOrSm ? '90%' : '60%',
      disableClose: true,
      data: {
        segment: segmentObject ? segmentObject : uuidv4(),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  confirmDelete(segmentObject: Segment, callback?: any) {
    const segment = `${segmentObject.id ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar el segmento "${segment}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(segmentObject.id ?? '');
      }
    );
  }

  delete(segmentId: string): void {
    this.segmentService.deleteCache(segmentId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Segmento eliminado con éxito!',
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
          data.mercedesCategoriaId?.toLowerCase().includes(lowerCaseTerm),
          data.segName?.toLowerCase().includes(lowerCaseTerm),
          data.descriptionShort?.toLowerCase().includes(lowerCaseTerm)
        ].some(fieldMatch => fieldMatch);  
      });
    };
  
    this.dataSource.filter = filterValue;  
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

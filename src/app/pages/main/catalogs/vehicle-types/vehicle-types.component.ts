import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { VehicleType } from 'src/app/models/vehicle-types/vehicle-type.model';
import { VehicleTypeService } from 'src/app/services/vehicle-types/vehicle-type.service';
import { v4 as uuidv4 } from 'uuid';
import { VehicleTypeDialogComponent } from './vehicle-type-dialog/vehicle-type-dialog.component';

@Component({
  selector: 'app-vehicle-types',
  templateUrl: './vehicle-types.component.html',
  styleUrls: ['./vehicle-types.component.scss'],
})
export class VehicleTypesComponent implements OnInit {
  TAG = VehicleTypesComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  vehicleTypes: VehicleType[] = [];
  isXsOrSm = false;
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['name', 'description', 'acciones'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private router: Router,
    private vehicleTypeService: VehicleTypeService
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
    const $combineLatest = combineLatest([this.vehicleTypeService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([vehicleTypes]) => {
        console.log(`${this.TAG} > getData > vehicleTypes`, vehicleTypes);
        this.vehicleTypes = vehicleTypes;
        this.dataSource = new MatTableDataSource<any>(this.vehicleTypes);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`VehicleTypes > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createOrUpdate(vehicleTypeObject?: VehicleType) {
    const dialogRef = this.dialog.open(VehicleTypeDialogComponent, {
      width: this.isXsOrSm ? '90%' : '30%',
      height: this.isXsOrSm ? '80%' : '50%',
      disableClose: true,
      data: {
        vehicleType: vehicleTypeObject ? vehicleTypeObject : uuidv4(),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  confirmDelete(vehicleTypeObject: VehicleType, callback?: any) {
    const vehicleType = `${vehicleTypeObject.name ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar el tipo de vehículo "${vehicleType}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(vehicleTypeObject.id ?? '');
      }
    );
  }

  delete(vehicleTypeId: string): void {
    this.vehicleTypeService.delete(vehicleTypeId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Tipo de vehículo eliminado con éxito!',
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

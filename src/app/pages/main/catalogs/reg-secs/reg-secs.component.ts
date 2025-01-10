import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { RegSec } from 'src/app/models/reg-secs/reg-sec.model';
import { RegSecService } from 'src/app/services/reg-secs/reg-sec.service';
import { v4 } from 'uuid';
import { RegSecDialogComponent } from './reg-sec-dialog/reg-sec-dialog.component';

@Component({
  selector: 'app-reg-secs',
  templateUrl: './reg-secs.component.html',
  styleUrls: ['./reg-secs.component.scss'],
})
export class RegSecsComponent implements OnInit {
  TAG = RegSecsComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  regSecs: RegSec[] = [];
  isXsOrSm = false;
  isLoading = true;
  fileBase64: string | ArrayBuffer | null = '';
  fileName = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'name',
    // 'description',
    'registry_number',
    'registry_province',
    'registry_department',
    'registry_location',
    'car_dealer',
    'truck_dealer',
    'van_dealer',
    'car_description',
    'truck_description',
    'van_description',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private regSecService: RegSecService
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
    const $combineLatest = combineLatest([this.regSecService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([regSecs]) => {
        console.log(`${this.TAG} > getData > regSecs`, regSecs);
        this.regSecs = regSecs;
        this.dataSource = new MatTableDataSource<any>(this.regSecs);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`regSec > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createOrUpdate(regSecObject?: RegSec) {
    const dialogRef = this.dialog.open(RegSecDialogComponent, {
      width: this.isXsOrSm ? '90%' : '50%',
      height: this.isXsOrSm ? '90%' : '80%',
      disableClose: true,
      data: {
        regSec: regSecObject ? regSecObject : v4(),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  confirmDelete(regSecObject: RegSec, callback?: any) {
    const regSec = `${regSecObject.id ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar el registro "${regSec}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(regSecObject.id ?? '');
      }
    );
  }

  delete(regSecId: string): void {
    this.regSecService.delete(regSecId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Registro eliminado con éxito!',
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
          data.name?.toLowerCase().includes(lowerCaseTerm),
          data.registryNumber?.toLowerCase().includes(lowerCaseTerm),
          data.registryProvince?.toLowerCase().includes(lowerCaseTerm),
          data.registryDepartment?.toLowerCase().includes(lowerCaseTerm),
          data.registryLocation?.toLowerCase().includes(lowerCaseTerm),
          data.autoZoneDealer?.toLowerCase().includes(lowerCaseTerm),
          data.autoZoneDescription?.toLowerCase().includes(lowerCaseTerm),
          data.truckZoneDealer?.toLowerCase().includes(lowerCaseTerm),
          data.truckZoneDescription?.toLowerCase().includes(lowerCaseTerm),
          data.vanZoneDealer?.toLowerCase().includes(lowerCaseTerm),
          data.vanZoneDescription?.toLowerCase().includes(lowerCaseTerm)
        ].some(fieldMatch => fieldMatch);  
      });
    };
  
    this.dataSource.filter = filterValue;  
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  importFile(file: Event) {
    console.log(file);
    let fileUploaded = (file.target as HTMLInputElement).files![0];
    const extensionName = fileUploaded.name
      .slice(fileUploaded.name.lastIndexOf('.'))
      .toLowerCase();
    if (
      extensionName == '.xls' ||
      extensionName == '.xlsx' ||
      extensionName == '.csv'
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(fileUploaded);
      console.log(reader);
      reader.onload = () => {
        this.fileBase64 = reader.result;
        this.fileName = fileUploaded.name;
        const formUpload = {
          base64: this.fileBase64,
          fileName: this.fileName,
        };
        console.log('formUpload', formUpload);
        console.log('this.fileBase64', this.fileBase64);
        console.log('this.fileName', this.fileName);
        this.regSecService.uploadFile(formUpload).subscribe({
          next: (response) => {
            Toast.fire({
              icon: 'success',
              title: '¡Archivo cargado con éxito!',
            });
            this.getData();
          },
          error: (err) => {
            console.error(`${this.TAG} > save > create > err`, err);
            const error = ErrorHelper.getErrorMessage(err);
            this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
          },
        });
      };
    } else {
      this.sweetAlert.error(
        '¡Ha ocurrido un error!',
        'Solo se permiten archivos de tipo .xls, .xlsx y .csv.',
        null,
        true
      );
    }
  }
}

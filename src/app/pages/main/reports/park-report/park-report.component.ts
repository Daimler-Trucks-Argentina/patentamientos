import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgxMatSelectComponent } from 'ngx-mat-select';
import { Subject } from 'rxjs';
import screenfull from 'screenfull';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GradoService } from 'src/app/services/grados/grado.service';
import { ReportService } from 'src/app/services/reports/reports.service';
import { RuleService } from 'src/app/services/rules/rule.service';
import { CustomPaginatorIntl } from 'src/app/shared/components/paginator/custom-paginator-intl';
import { WorkSheet, utils, WorkBook, write } from 'xlsx';

@Component({
  selector: 'app-park-report',
  templateUrl: './park-report.component.html',
  styleUrl: './park-report.component.scss'
})
export class ParkReportComponent {
  TAG = ParkReportComponent.name;
  private unsubscribeAll: Subject<any>;
  isXsOrSm = false;
  isLoading = false;
  showFilter = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;
  @ViewChild(NgxMatSelectComponent) filterPat!: NgxMatSelectComponent;
  @ViewChild(MatSelect) matSelect!: MatSelect;
  @ViewChild(MatCheckbox) matCheckbox!: MatCheckbox;
  fullScreen = {
    isEnabled: false,
    isFullscreen: false,
  };
  code: any = { value: '' };
  form = new FormGroup({
      fromDate: new FormControl(null, { validators: [Validators.required] }),
      toDate: new FormControl(null, { validators: [Validators.required] }),
    });
    get fromDate() {
      return this.form.get('fromDate')!.value;
    }
    get toDate() {
      return this.form.get('toDate')!.value;
    }
    pipe: DatePipe;
  displayedColumns: string[] = [
    'Dominio',
    'chasis',
    'fechaInsc',
    'mercedesModeloId',
    'descripcionModelo',
    'versionPatentamiento',
    'descripcionVerPat',
    'segmento',
    'segmentoDescription',
    'idConfiguracion',
    'configuracion',
    'Provincia',
    'Departamento',
    'id Nro de Registro',
    'Nro de Registro',
    'Registro/Provincia',
    'Registro/Depto',
    'Concesionario z/auto',
    'Concesionario z/Van',
    'Conce. zona camion',
    'Pat'
];


  dataSource = new MatTableDataSource<any>();

  pageSizeOptions: number[] = [50, 100, 500, 1000];
  pageSize: number = this.pageSizeOptions[0];
  pageNumber: number = 1;
  totalItems?: number;

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private ruleService: RuleService,
    private gradoService: GradoService,
    private reportService: ReportService
  ) {
    this.pipe = new DatePipe('en');
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
      this.getReports()
  }

  ngAfterViewInit() {
      this.paginator._intl = new CustomPaginatorIntl();
      this.paginator._intl.itemsPerPageLabel = 'Registros:';
      this.paginator._intl.changes.next();
      this.paginator.page.subscribe((event: PageEvent) => {
        this.pageNumber = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.getReports();
      });
    }

  toggleFullscreen() {
    console.log(screenfull); 
    if (!this.fullScreen.isEnabled) {
      this.fullScreen.isEnabled = true;
      if (!screenfull.isFullscreen) screenfull.toggle();
      this.getReports();
      this.pageSize = 150;
      this.authService.onDrawerOpenedEmitter.emit(false);
      this.authService.onHeaderEmitter.emit(false);
    } else {
      this.fullScreen.isEnabled = false;
      this.getReports();
      this.pageSize = 5;
      this.authService.onDrawerOpenedEmitter.emit(true);
      this.authService.onHeaderEmitter.emit(true);
      if (screenfull.isFullscreen) screenfull.toggle();
    }
  }

  getReports(pageNumber?: number, pageSize?: number) {
      this.isLoading = true;
      const dates = this.form.getRawValue();
      const dateFrom: string = dates.fromDate
        ? new Date(dates.fromDate!).toISOString()
        : '';
      const dateTo: string = dates.toDate
        ? new Date(dates.toDate!).toISOString()
        : '';
  
        const year: number = 2024
        const month: number = 1        
    
        this.reportService
          .getParkReport( this.pageNumber, this.pageSize, year, month)
        .subscribe({
          next: (response) => {
            this.dataSource = new MatTableDataSource<any>(response.results);
            console.log(response.results)
            this.totalItems = response.totalItems;
            this.pageNumber = response.pageNumber;
            this.pageSize = response.pageSize;
  
  
            if (this.dataSource.data.length === 0) {
              Toast.fire({
                icon: 'info',
                title: 'No se encontraron resultados.',
              });
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            const error = ErrorHelper.getErrorMessage(err);
            this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
          },
        });
    }
  
    onPageChange(event: PageEvent): void {
      this.pageSize = event.pageSize;
      this.pageNumber = event.pageIndex + 1;
      this.getReports(this.pageNumber);
    }

    toggleFilter() {
      if (!this.showFilter) {
        this.showFilter = true;
        this.expansionPanel.open();
      } else {
        this.showFilter = false;
        this.expansionPanel.close();
      }
    }

    openFilter() {
      this.filterPat.panel.open();
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }


    // #REGION DOWNLOAD
    downloadXLS(): void {
        this.isLoading = true;
        const dates = this.form.getRawValue();
        const dateFrom: string = dates.fromDate ? new Date(dates.fromDate!).toISOString() : '';
        const dateTo: string = dates.toDate ? new Date(dates.toDate!).toISOString() : new Date().toISOString();
        const year: number = 2024
        const month: number = 1        
    
        this.reportService
          .getParkReport(1, 1000000, year, month)
          .subscribe({
            next: (response) => {
    
              if (!response.results || response.results.length === 0) {
                console.warn('No hay datos para exportar.');
                this.isLoading = false;
                this.sweetAlert.warning('Atención', 'No hay datos para exportar.', null, true);
                return;
              }
              const cleanedData = response.results.map(this.flattenData);
  
              const worksheet: WorkSheet = utils.json_to_sheet(cleanedData, {
                header: Object.keys(cleanedData[0])
              });
    
              const workbook: WorkBook = {
                Sheets: { parkReport: worksheet },
                SheetNames: ['parkReport']
              };
    
              const excelBuffer: any = write(workbook, {
                bookType: 'xlsx',
                type: 'array'
              });
    
              console.log('Buffer generado:', excelBuffer);
    
              this.saveAsExcelFile(excelBuffer, 'parkReport');
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
              const error = ErrorHelper.getErrorMessage(err);
              this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
            },
          });
      }
    
      saveAsExcelFile(buffer: any, fileName: string): void {
        try {
          const data: Blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
    
          const url: string = window.URL.createObjectURL(data);
          const a: HTMLAnchorElement = document.createElement('a');
          a.href = url;
          a.download = `${fileName}.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
    
          console.log(`Archivo ${fileName}.xlsx guardado con éxito.`);
        } catch (error) {
          console.error('Error al guardar el archivo:', error);
          this.sweetAlert.error('Error', 'No se pudo descargar el archivo.', null, true);
        }
      }
    
      flattenData(item: any): any {
        const flattened: any = {};
    
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            if (typeof item[key] === 'object' && item[key] !== null) {
              for (const nestedKey in item[key]) {
                if (item[key].hasOwnProperty(nestedKey)) {
                  flattened[`${key}_${nestedKey}`] = item[key][nestedKey];
                }
              }
            } else {
              flattened[key] = item[key];
            }
          }
        }
    
        return flattened;
      }

      resetFiltering() {
          this.form.reset();
          this.matSelect.options.forEach((data: MatOption) => data.deselect());
          this.code.value = '';
          this.matCheckbox['checked'] = false;
        }
}

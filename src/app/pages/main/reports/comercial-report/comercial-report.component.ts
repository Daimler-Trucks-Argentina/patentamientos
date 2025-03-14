import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import screenfull from 'screenfull';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ReportService } from 'src/app/services/reports/reports.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatExpansionPanel } from '@angular/material/expansion';
import { NgxMatSelectComponent } from 'ngx-mat-select';
import { WorkSheet, utils, WorkBook, write } from 'xlsx';
import { MatOption } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CustomPaginatorIntl } from 'src/app/shared/components/paginator/custom-paginator-intl';


@Component({
  selector: 'app-comercial-report',
  templateUrl: './comercial-report.component.html',
  styleUrls: ['./comercial-report.component.scss']
})
export class ComercialReportsComponent {
  private unsubscribeAll: Subject<any>;
  isXsOrSm = false;
  isLoading = false;
  showFilter = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatButtonToggleModule) toggle!: MatButtonToggleModule;
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
  dateForm = new FormGroup({
      fromDate: new FormControl(null),
      toDate: new FormControl(null),
      year: new FormControl<any>(null),
      month: new FormControl<any>(null)

      
    });
  form = new FormGroup({
      filterType: new FormControl<any>('range'),
      plate: new FormControl<any>(null),
      chasis: new FormControl<any>(null),
      ofmm: new FormControl<any>(null),
      cuitTitular: new FormControl<any>(null),

      
    });
    get period() {
      return this.form.get('period')!.value;
    }
    pipe: DatePipe;
  displayedColumns: string[] = [
    'plate',
    'chasis',
    'motor',
    'mercedesTerminalId',
    'descripcionTerminal',
    'mercedesMarcaId',
    'descripcionMarca',
    'mercedesModeloId',
    'descripcionModelo',
    'versionPatentamiento',
    'descripcionVerPat',
    'segCategoria',
    'categoriaDescription',
    'segmento',
    'segmentoDescription',
    'bodyStyle',
    'bodyStyleDescription',
    'mercedesConfiguration',
    'carreoceriaDescription',
    'ofmm',
    'ofmmOrigen',
    'ofmmFabrica',
    'fabricaDescripcion',
    'ofmmMarca',
    //'ofmmDescription(Descripc OFMM marca )',
    'ofmmModelo',
    //'ofmmDescription(Descripc OFMM modelo )',
    'ofmmDescription1',
    'ofmmDescription2',
    'fechaPatentamiento',
    'fechaCarga',
    'anioPeriodoCierre',
    'mesPeriodoCierre',
    'yearModelo',
    'titular',
    'registroDepto',
    'registroLocalidad',
    'registroProvincia',
    'conceZonaCamion',
    'descCEZCamion',
    //'conceZonaVan',
    //'descCEZVan',
    //'conceZonaCamion',
    //'descCEZCamion',
    //'conceZonaAuto',
    //'descCEZAuto',
    'cuitTitular',
    'tipoClienteGub',
    'tipoClienteGubDescription',
    'titularGubernamental',
    'categoriaGubernamen',
    'catGubDescription',
    'segmentoGubernament',
    'descSegGub',
    //'descSegGub',
    'esPatGubernamental',
    'clasificCUIT',
    'clasificacionCUITDescription',
    'codpaispr',
    'codpaisfa',
    'codpro',
    //'descr prov',
    'codauto',
    'codfab',
    'codmar',
    'codmod',
    'codpro',
    'peso',
    'cantidadPatentes'
    //'cantidadPatentes'
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
    private authService: AuthService,
    private reportService: ReportService
  ) {
    this.pipe = new DatePipe('en');
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
      this.paginator._intl = new CustomPaginatorIntl();
      this.paginator._intl.itemsPerPageLabel = 'Registros:';
      this.paginator._intl.changes.next();
      this.paginator.page.subscribe((event: PageEvent) => {
        this.pageNumber = event.pageIndex + 1;
        this.pageSize = event.pageSize;
      });
    }

  toggleFullscreen() {
    console.log(screenfull); 
    if (!this.fullScreen.isEnabled) {
      this.fullScreen.isEnabled = true;
      if (!screenfull.isFullscreen) screenfull.toggle();
      this.searchReports();
      this.pageSize = 150;
      this.authService.onDrawerOpenedEmitter.emit(false);
      this.authService.onHeaderEmitter.emit(false);
    } else {
      this.fullScreen.isEnabled = false;
      this.searchReports();
      this.pageSize = 50;
      this.authService.onDrawerOpenedEmitter.emit(true);
      this.authService.onHeaderEmitter.emit(true);
      if (screenfull.isFullscreen) screenfull.toggle();
    }
  }
  
  searchReports(pageNumber?: number, pageSize?: number) {
    this.isLoading = true;
    const dates = this.dateForm.getRawValue();

    const dateFrom: string = dates.fromDate ? new Date(dates.fromDate!).toISOString() : '';
    const dateTo: string = dates.toDate ? new Date(dates.toDate!).toISOString() : '';
    const selectedYear = this.dateForm.value.year;
    const selectedMonth = this.dateForm.value.month;
  
  
    const plate = this.form.value.plate || null;
    const chasis = this.form.value.chasis || null;
    const ofmm = this.form.value.ofmm || null;
    const cuitTitular = this.form.value.cuitTitular || null;
  
    this.reportService
      .getComercialReport(dateFrom, 
        dateTo, 
        (pageNumber = this.pageNumber),
        (pageSize = this.pageSize), 
        selectedYear, 
        selectedMonth, 
        plate, chasis, ofmm, cuitTitular)
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource<any>(
            response.results.map((item: { [x: string]: any; }) => ({
              ...item,
              anioPeriodoCierre: item['añoPeriodoCierre'],
              fechaPatentamiento: item['fechaPatentamiento'] ? this.formatDate(item['fechaPatentamiento']) : '-',
              fechaCarga: item['fechaCarga'] ? this.formatDate(item['fechaCarga']) : '-'
            }))
          );
  
          this.totalItems = response.totalItems;
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
  

    formatDate(dateString: string): string {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}-${month}-${year}`;
    }
  
    onPageChange(event: PageEvent): void {
      this.pageSize = event.pageSize;
      this.pageNumber = event.pageIndex + 1;
      this.searchReports(this.pageNumber);
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

    // #REGION DOWNLOAD
    downloadXLS(): void {
      this.isLoading = true;
      const dates = this.dateForm.getRawValue();
      const dateFrom: string = dates.fromDate ? new Date(dates.fromDate!).toISOString() : '';
      const dateTo: string = dates.toDate ? new Date(dates.toDate!).toISOString() : '';
      const selectedYear = this.dateForm.value.year;
      const selectedMonth = this.dateForm.value.month;
    
      this.reportService
        .getComercialReport(dateFrom, dateTo, 1, this.totalItems, selectedYear, selectedMonth)
        .subscribe({
          next: (response) => {
            if (!response.results || response.results.length === 0) {
              console.warn('No hay datos para exportar.');
              this.isLoading = false;
              this.sweetAlert.warning('Atención', 'No hay datos para exportar.', null, true);
              return;
            }
    
            const cleanedData = response.results.map((item: { [x: string]: any }) => ({
              ...item,
              fechaPatentamiento: item['fechaPatentamiento'] ? this.formatDate(item['fechaPatentamiento']) : '-',
                fechaCarga: item['fechaCarga'] ? this.formatDate(item['fechaCarga']) : '-'
            }));
    
            const worksheet: WorkSheet = utils.json_to_sheet(cleanedData, {
              header: Object.keys(cleanedData[0])
            });
    
            const workbook: WorkBook = {
              Sheets: { comercialReport: worksheet },
              SheetNames: ['comercialReport']
            };
    
            const excelBuffer: any = write(workbook, {
              bookType: 'xlsx',
              type: 'array'
            });
    
            console.log('Buffer generado:', excelBuffer);
    
            this.saveAsExcelFile(excelBuffer, 'comercialReport');
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
          this.dateForm.reset();
          this.form.reset();
          this.matSelect.options.forEach((data: MatOption) => data.deselect());
          this.code.value = '';
          this.matCheckbox['checked'] = false;
        }
        resetFilterType(){
          this.dateForm.reset();
        }
}

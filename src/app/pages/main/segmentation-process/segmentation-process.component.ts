import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import screenfull from 'screenfull';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { Category } from 'src/app/models/categories/category.model';
import { SegmentationPlate } from 'src/app/models/segmentation-plates/segmentation-plate.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CategoryService } from 'src/app/services/categories/category.service';
import { SegmentationPlateService } from 'src/app/services/segmentation-plates/segmentation-plate.service';

@Component({
  selector: 'app-segmentation-process',
  templateUrl: './segmentation-process.component.html',
  styleUrls: ['./segmentation-process.component.scss'],
})
export class SegmentationProcessComponent implements OnInit {
  TAG = SegmentationProcessComponent.name;
  private unsubscribeAll: Subject<any>;
  isXsOrSm = false;
  isLoading = false;
  formGroup: FormGroup;
  loading = false;
  loadingShow = false;
  textShow = 'Ver segmentación';
  buttonText = 'Procesar segmentación';
  records: number = 0;
  options: string[] = [];
  fullScreen = {
    isEnabled: false,
    isFullscreen: false,
  };
  fileId: string = '';
  pageSize: number = 5;
  segmentationPlates: SegmentationPlate[] = [];
  categories: Category[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'dominio',
    'chasis',
    'motor',
    'ofmm',
    'terminal',
    'marca',
    'modelo',
    'version_clave',
    'seg_name',
    'seg_category',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private formBuilder: FormBuilder,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper,
    private segmentationPlateService: SegmentationPlateService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((p) => {
      this.fileId = p['fileId'];
    });
    this.unsubscribeAll = new Subject();
    this.formGroup = this.createFormGroup();
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
    this.getCategories();
    if (this.fileId) {
      this.getByFileId(this.fileId);
    }
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      dateFrom: [
        {
          value: null,
          disabled: false,
        },
        [Validators.required],
      ],
      dateTo: [
        {
          value: null,
          disabled: false,
        },
        [Validators.required],
      ],
      optionId: [
        {
          value: null,
          disabled: false,
        },
        [],
      ],
    });
    return formGroup;
  }

  getCategories() {
    this.isLoading = true;
    if (this.categories.length == 0) {
      this.textShow = '';
      this.loadingShow = true;
    }
    const $combineLatest = combineLatest([this.categoryService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([categories]) => {
        console.log(`${this.TAG} > getData > categories`, categories);
        this.categories = categories;
        const all: Category = {
          id: null,
          autoId: 0,
          segCategory: 'all',
          description: 'Todos',
        };
        categories.push(all);
        this.categories.sort((a, b) => {
          if (a.segCategory == all.segCategory) return -1;
          if (b.segCategory == all.segCategory) return 1;
          return a.segCategory!.localeCompare(b.segCategory!);
        }); // Agrega a la opción "ALL" como primera.
        this.loadingShow = false;
        this.textShow = 'Ver segmentación';
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.loadingShow = false;
        this.textShow = 'Ver segmentación';
        console.error(`${this.TAG} > save > create > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingShow = false;
        this.textShow = 'Ver segmentación';
      },
    });
  }

  getByCategory(category: Category) {
    this.isLoading = true;
    if (this.categories.length == 0) {
      this.textShow = '';
      this.loadingShow = true;
    }
    const $combineLatest = combineLatest([
      this.segmentationPlateService.getByCategory(category.segCategory!),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([segmentationPlates]) => {
        console.log(
          `${this.TAG} > getData > segmentationPlates`,
          segmentationPlates
        );
        this.segmentationPlates = segmentationPlates;
        this.dataSource = new MatTableDataSource<any>(segmentationPlates);
        this.sortAndPaginate();
        if (this.dataSource.data.length === 0) {
          Toast.fire({
            icon: 'info',
            title: 'No se encontraron resultados.',
          });
        }
        this.loadingShow = false;
        this.textShow = 'Ver segmentación';
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.loadingShow = false;
        this.textShow = 'Ver segmentación';
        console.error(`${this.TAG} > save > create > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingShow = false;
        this.textShow = 'Ver segmentación';
      },
    });
  }

  getByFileId(fileId: string) {
    console.log(fileId);
    this.isLoading = true;
    if (this.categories.length == 0) {
      this.textShow = '';
      this.loadingShow = true;
    }
    const $combineLatest = combineLatest([
      this.segmentationPlateService.getByFileId(fileId),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([segmentationPlates]) => {
        console.log(
          `${this.TAG} > getData > segmentationPlates`,
          segmentationPlates
        );
        this.segmentationPlates = segmentationPlates;
        this.dataSource = new MatTableDataSource<any>(segmentationPlates);
        this.sortAndPaginate();
        if (this.dataSource.data.length === 0) {
          Toast.fire({
            icon: 'info',
            title: 'No se encontraron resultados.',
          });
        }
        this.loadingShow = false;
        this.textShow = 'Ver segmentación';
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.loadingShow = false;
        this.textShow = 'Ver segmentación';
        console.error(`${this.TAG} > save > create > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingShow = false;
        this.textShow = 'Ver segmentación';
      },
    });
  }

  getData(category?: Category) {
    console.log(category);
    this.isLoading = true;
    let filtered = this.segmentationPlates;
    if (this.categories.length >= 1) {
      this.textShow = '';
      this.loadingShow = true;
    }
    if (category?.segCategory != 'all') {
      filtered = this.segmentationPlates.filter(
        (sp) => sp.keyVersion?.segCategory == category?.segCategory
      );
    }
    this.dataSource = new MatTableDataSource<any>(filtered);
    this.sortAndPaginate();
    if (this.dataSource.data.length === 0) {
      Toast.fire({
        icon: 'info',
        title: 'No se encontraron resultados.',
      });
    }
    this.loadingShow = false;
    this.textShow = 'Ver segmentación';
    this.isLoading = false;
  }

  sortAndPaginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'dominio':
          return item.patenting.plate;
        case 'chasis':
          return item.patenting.chasis;
        case 'motor':
          return item.patenting.motor;
        case 'ofmm':
          return item.ofmm.zofmm;
        case 'terminal':
          return item.keyVersion.mercedesTerminalId;
        case 'marca':
          return item.keyVersion.mercedesMarcaId;
        case 'modelo':
          return item.keyVersion.mercedesModeloId;
        case 'version_clave':
          return item.keyVersion.mercedesVersionClaveId;
        case 'seg_name':
          return item.keyVersion.segName;
        case 'seg_category':
          return item.keyVersion.segCategory;
        default:
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  processSegmentations(): void {
    this.loading = true;
    this.buttonText = '';
    const rawValue = this.formGroup.getRawValue();
    console.log(`${this.TAG} > save > rawValue`, rawValue);
    const dto = {
      dateFrom: rawValue.dateFrom.toISOString().split('T')[0],
      dateTo: rawValue.dateTo.toISOString().split('T')[0],
    };
    console.log(dto);

    this.segmentationPlateService
      .processSegmentations(dto.dateFrom, dto.dateTo)
      .subscribe({
        next: (response) => {
          console.log(`${this.TAG} > getData > segmentationPlates`, response);
          this.records = response;
          // this.segmentationPlates = response;
          // this.dataSource = new MatTableDataSource<any>(
          //   this.segmentationPlates
          // );
          // this.sortAndPaginate();
          // if (this.dataSource.data.length === 0) {
          //   Toast.fire({
          //     icon: 'info',
          //     title: 'No se encontraron resultados.',
          //   });
          // }
        },
        error: (err) => {
          this.loading = false;
          this.buttonText = 'Procesar segmentación';
          console.error(`${this.TAG} > save > create > err`, err);
          const error = ErrorHelper.getErrorMessage(err);
          this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        },
        complete: () => {
          this.loading = false;
          this.buttonText = 'Procesar segmentación';
        },
      });
  }

  toggleFullscreen() {
    if (!this.fullScreen.isEnabled) {
      this.fullScreen.isEnabled = true;
      if (!screenfull.isFullscreen) screenfull.toggle();
      this.getData(this.formGroup.controls['optionId'].value);
      this.pageSize = 100;
      this.authService.onDrawerOpenedEmitter.emit(false);
      this.authService.onHeaderEmitter.emit(false);
    } else {
      this.fullScreen.isEnabled = false;
      this.getData(this.formGroup.controls['optionId'].value);
      this.pageSize = 5;
      this.authService.onDrawerOpenedEmitter.emit(true);
      this.authService.onHeaderEmitter.emit(true);
      if (screenfull.isFullscreen) screenfull.toggle();
    }
  }
}

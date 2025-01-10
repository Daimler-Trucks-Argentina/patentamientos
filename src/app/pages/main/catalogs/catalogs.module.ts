import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrandService } from 'src/app/services/brands/brand.service';
import { CarModelService } from 'src/app/services/car-models/car-model.service';
import { FactoryService } from 'src/app/services/factories/factory.service';
import { InternalVersionService } from 'src/app/services/internal-versions/internal-version.service';
import { KeyVersionService } from 'src/app/services/key-versions/key-version.service';
import { OfmmService } from 'src/app/services/ofmms/ofmm.service';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import { TmmvService } from 'src/app/services/tmmvs/tmmv.service';
import { VehicleTypeService } from 'src/app/services/vehicle-types/vehicle-type.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrandDialogComponent } from './brands/brand-dialog/brand-dialog.component';
import { BrandsComponent } from './brands/brands.component';
import { CarModelDialogComponent } from './car-models/car-model-dialog/car-model-dialog.component';
import { CarModelsComponent } from './car-models/car-models.component';
import { CatalogsRoutingModule } from './catalogs-routing.module';
import { CatalogsComponent } from './catalogs.component';
import { FactoriesComponent } from './factories/factories.component';
import { FactoryDialogComponent } from './factories/factory-dialog/factory-dialog.component';
import { KeyVersionDialogComponent } from './key-versions/key-version-dialog/key-version-dialog.component';
import { KeyVersionsComponent } from './key-versions/key-versions.component';
import { OfmmDialogComponent } from './ofmms/ofmm-dialog/ofmm-dialog.component';
import { OfmmsComponent } from './ofmms/ofmms.component';
import { TerminalDialogComponent } from './terminals/terminal-dialog/terminal-dialog.component';
import { TerminalsComponent } from './terminals/terminals.component';
import { TmmvDialogComponent } from './tmmvs/tmmv-dialog/tmmv-dialog.component';
import { TmmvsComponent } from './tmmvs/tmmvs.component';
import { VehicleTypeDialogComponent } from './vehicle-types/vehicle-type-dialog/vehicle-type-dialog.component';
import { VehicleTypesComponent } from './vehicle-types/vehicle-types.component';
import { InternalVersionSegmentationService } from 'src/app/services/internal-version-segmentations/internal-version-segmentation.service';
import { CategoryService } from 'src/app/services/categories/category.service';
import { SegmentService } from 'src/app/services/segments/segment.service';
import { SegmentsComponent } from './segments/segments.component';
import { InternalVersionsComponent } from './internal-versions/internal-versions.component';
import { InternalVersionSegmentationsComponent } from './internal-version-segmentations/internal-version-segmentations.component';
import { CategoriesComponent } from './categories/categories.component';
import { InternalVersionSegmentationDialogComponent } from './internal-version-segmentations/internal-version-segmentation-dialog/internal-version-segmentation-dialog.component';
import { CategoryDialogComponent } from './categories/category-dialog/category-dialog.component';
import { InternalVersionDialogComponent } from './internal-versions/internal-version-dialog/internal-version-dialog.component';
import { SegmentDialogComponent } from './segments/segment-dialog/segment-dialog.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { RegSecsComponent } from './reg-secs/reg-secs.component';
import { RegSecDialogComponent } from './reg-secs/reg-sec-dialog/reg-sec-dialog.component';
import { RegSecService } from 'src/app/services/reg-secs/reg-sec.service';
import { MultipleOfmmDialogComponent } from './ofmms/multiple-ofmm-dialog/multiple-ofmm-dialog.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { GradosComponent } from './grados/grados.component';
import { GradoDialogComponent } from './grados/grado-dialog/grado-dialog.component';
import { WholesaleVersionService } from 'src/app/services/wholesale-versions/wholesale-version.service';
import { PatentingVersionService } from 'src/app/services/patenting-versions/patenting-version.service';
import { PatentingVersionDialogComponent } from './patenting-versions/patenting-version-dialog/patenting-version-dialog.component';
import { WholesaleVersionsDialogComponent } from './wholesale-versions/wholesale-versions-dialog/wholesale-versions-dialog.component';
import { CatInternalVersionService } from 'src/app/services/cat-internal-versions/cat-internal-versions.service'; 
import { PatentingVersionsComponent } from './patenting-versions/patenting-versions.component';
import { WholeSalesVersionsComponent } from './wholesale-versions/wholesale-versions.component';
import { UpdateOfmmsDialogComponent } from './ofmms/update-ofmms-dialog/update-ofmms.component';

@NgModule({
  declarations: [
    CatalogsComponent,
    BrandsComponent,
    FactoriesComponent,
    FactoryDialogComponent,
    BrandDialogComponent,
    TerminalsComponent,
    TerminalDialogComponent,
    VehicleTypesComponent,
    VehicleTypeDialogComponent,
    CarModelsComponent,
    CarModelDialogComponent,
    OfmmsComponent,
    OfmmDialogComponent,
    UpdateOfmmsDialogComponent,
    TmmvsComponent,
    TmmvDialogComponent,
    KeyVersionsComponent,
    KeyVersionDialogComponent,
    SegmentsComponent,
    SegmentDialogComponent,
    InternalVersionsComponent,
    InternalVersionDialogComponent,
    InternalVersionSegmentationsComponent,
    InternalVersionSegmentationDialogComponent,
    PatentingVersionsComponent,
    PatentingVersionDialogComponent,
    CategoriesComponent,
    CategoryDialogComponent,
    RegSecsComponent,
    RegSecDialogComponent,
    MultipleOfmmDialogComponent,
    WholeSalesVersionsComponent,
    WholesaleVersionsDialogComponent,
    GradosComponent,
    GradoDialogComponent,
    PatentingVersionDialogComponent,
    WholesaleVersionsDialogComponent, 
  ],
  imports: [CommonModule, CatalogsRoutingModule, SharedModule, ClipboardModule],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    BrandService,
    FactoryService,
    TerminalService,
    VehicleTypeService,
    CarModelService,
    OfmmService,
    TmmvService,
    InternalVersionService,
    InternalVersionSegmentationService,
    WholesaleVersionService,
    PatentingVersionService,   
    CatInternalVersionService, 
    CategoryService,
    SegmentService,
    KeyVersionService,
    RegSecService
  ],
})
export class CatalogsModule {}

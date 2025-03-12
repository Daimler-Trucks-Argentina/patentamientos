import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CategoryService } from 'src/app/services/categories/category.service';
import { RuleService } from 'src/app/services/rules/rule.service';
import { HeaderModule } from 'src/app/shared/components/header/header.module';
import { NavigationModule } from 'src/app/shared/components/navigation/navigation.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainComponent } from '../main/main.component';
import { FileListModule } from './file-list/file-list.module';
import { HomeModule } from './home/home.module';
import { MainRoutingModule } from './main-routing.module';
import { PatentingViewDialogComponent } from './patenting/patenting-view-dialog/patenting-view-dialog.component';
import { PatentingComponent } from './patenting/patenting.component';
import { SegmentationProcessComponent } from './segmentation-process/segmentation-process.component';
import { SalesProcessComponent } from './sales-process/sales-process.component';
import { OdsWholesaleService } from 'src/app/services/odswholesales/odswholesale.service';
import { SalesProcessViewDialogComponent } from './sales-process/sales-process-view-dialog/sales-process-view-dialog.component';
import { GradoService } from 'src/app/services/grados/grado.service';
import { SpecialSalesProcessComponent } from './special-sales-process/special-sales-process.component';
import { OdsSpecialWholesaleService } from 'src/app/services/ods-special-wholesales/ods-special-wholesale.service';
import { TmmvService } from 'src/app/services/tmmvs/tmmv.service';  
import { PatentingsReportingComponent } from './catalogs/reportings/patentings-reporting/patentings-reporting.component';
import { ExtractionsReportingComponent } from './catalogs/reportings/extractions-reporting/extractions-reporting.component';
import { PatentingVersionService } from 'src/app/services/patenting-versions/patenting-version.service';
import { ComercialReportsComponent } from './reports/comercial-report/comercial-report.component';
import { ParkReportComponent } from './reports/park-report/park-report.component';
import { DailyReportComponent } from './reports/daily-report/daily-report.component';


@NgModule({
  declarations: [
    MainComponent,
    PatentingComponent,
    PatentingViewDialogComponent,
    SegmentationProcessComponent,
    SalesProcessComponent,
    SalesProcessViewDialogComponent,
    SpecialSalesProcessComponent,    
    ExtractionsReportingComponent,
    PatentingsReportingComponent,
    ComercialReportsComponent,
    ParkReportComponent,
    DailyReportComponent
  ],
  imports: [
    SharedModule,
    MainRoutingModule,
    HomeModule,
    HeaderModule,
    MatSidenavModule,
    NavigationModule,
    FileListModule, 
  ],
  providers: [
    RuleService,
    CategoryService,
    OdsWholesaleService,
    GradoService,
    OdsSpecialWholesaleService,
    TmmvService,
    PatentingVersionService
  ],
})
export class MainModule {}

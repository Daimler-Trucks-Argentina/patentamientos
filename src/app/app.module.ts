import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainErrorHttpInterceptor } from './core/interceptors/main-error.http-interceptor';
import { MainHttpInterceptor } from './core/interceptors/main.http-interceptor';
import { AuthService } from './services/auth/auth.service';
import { BrandService } from './services/brands/brand.service';
import { CarModelService } from './services/car-models/car-model.service';
import { FactoryService } from './services/factories/factory.service';
import { PatentingService } from './services/patentings/patenting.service';
import { PermissionService } from './services/permissions/permission.service';
import { RoleService } from './services/roles/role.service';
import { SecurityParameterService } from './services/security-parameters/security-parameters.service';
import { UserService } from './services/users/user.service';
import { VehicleTypeService } from './services/vehicle-types/vehicle-type.service';
import { ClosureService } from './services/closures/closure.service';
import { SegmentationPlateService } from './services/segmentation-plates/segmentation-plate.service';
import { TerminalService } from './services/terminals/terminal.service';
import { OfmmService } from './services/ofmms/ofmm.service';
import { getSpanishPaginatorIntl } from './core/helpers/custom-paginator.helper';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ReportService } from './services/reports/reports.service';
import { WholesaleVersionService } from './services/wholesale-versions/wholesale-version.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MainHttpInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainErrorHttpInterceptor,
      multi: true,
    },
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    AuthService,
    RoleService,
    UserService,
    SecurityParameterService,
    PermissionService,
    PatentingService,
    BrandService,
    CarModelService,
    FactoryService,
    VehicleTypeService,
    TerminalService,
    OfmmService,
    ClosureService,
    SegmentationPlateService,
    ReportService,
    WholesaleVersionService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

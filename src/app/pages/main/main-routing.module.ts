import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { PatentingComponent } from './patenting/patenting.component';
import { SegmentationProcessComponent } from './segmentation-process/segmentation-process.component'; 
import { SalesProcessComponent } from './sales-process/sales-process.component';
import { SpecialSalesProcessComponent } from './special-sales-process/special-sales-process.component'; 
import { ComercialReportsComponent } from './reports/comercial-report/comercial-report.component';
import { ParkReportComponent } from './reports/park-report/park-report.component';
import { DailyReportComponent } from './reports/daily-report/daily-report.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'file-list',
        loadChildren: () =>
          import('./file-list/file-list.module').then((m) => m.FileListModule),
      },
      {
        path: 'security/users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'security/users/user',
        loadChildren: () =>
          import('./users/add-user/add-user.module').then(
            (m) => m.AddUserModule
          ),
      },
      {
        path: 'security/roles-and-permissions',
        loadChildren: () =>
          import('./roles-permissions/roles-permissions.module').then(
            (m) => m.RolesPermissionsModule
          ),
      },
      {
        path: 'security/roles-and-permissions/role',
        loadChildren: () =>
          import('./roles-permissions/add-role/add-role.module').then(
            (m) => m.AddRoleModule
          ),
      },
      {
        path: 'security/parameter',
        loadChildren: () =>
          import('./parameters/parameters.module').then(
            (m) => m.ParametersModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'catalogs',
        loadChildren: () =>
          import('./catalogs/catalogs.module').then((m) => m.CatalogsModule),
      },
      {
        path: 'patenting',
        component: PatentingComponent,
      },
      {
        path: 'segmentation-process',
        component: SegmentationProcessComponent,
      },
      {
        path: 'sales-process',
        component: SalesProcessComponent,
      },
      {
        path: 'special-sales-process',
        component: SpecialSalesProcessComponent,
      },
      {
        path: 'reports/comercial-report',
        component: ComercialReportsComponent,
      },
      {
        path: 'reports/daily-report',
        component: DailyReportComponent,
      },
      /*{
        path: 'reports/park-report',
        component: ParkReportComponent,
      },*/
      {
        path: '',
        redirectTo: '/pages/main/file-list',
        pathMatch: 'full',
      },
     /* {
        path: 'reporting/extractions',
        component: ExtractionsReportingComponent,
      },

      {
        path: 'reporting/patentings',
        component: PatentingsReportingComponent,
      },*/
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}

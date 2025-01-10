import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandsComponent } from './brands/brands.component';
import { CarModelsComponent } from './car-models/car-models.component';
import { CatalogsComponent } from './catalogs.component';
import { FactoriesComponent } from './factories/factories.component';
import { TerminalsComponent } from './terminals/terminals.component';
import { VehicleTypesComponent } from './vehicle-types/vehicle-types.component';
import { OfmmsComponent } from './ofmms/ofmms.component';
import { TmmvsComponent } from './tmmvs/tmmvs.component';
import { KeyVersionsComponent } from './key-versions/key-versions.component';
import { CategoriesComponent } from './categories/categories.component';
import { InternalVersionsComponent } from './internal-versions/internal-versions.component';
import { InternalVersionSegmentationsComponent } from './internal-version-segmentations/internal-version-segmentations.component';
import { SegmentsComponent } from './segments/segments.component';
import { RegSecsComponent } from './reg-secs/reg-secs.component';
import { GradosComponent } from './grados/grados.component';
import { PatentingVersionsComponent } from './patenting-versions/patenting-versions.component';
import { WholeSalesVersionsComponent } from './wholesale-versions/wholesale-versions.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogsComponent,
    children: [
      { path: 'brands', component: BrandsComponent },
      { path: 'car-models', component: CarModelsComponent },
      { path: 'factories', component: FactoriesComponent },
      { path: 'terminals', component: TerminalsComponent },
      { path: 'vehicle-types', component: VehicleTypesComponent },
      { path: 'ofmm', component: OfmmsComponent },
      { path: 'tmmv', component: TmmvsComponent },
      { path: 'key-versions', component: KeyVersionsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'internal-versions', component: InternalVersionsComponent },
      { path: 'internal-version-segmentations', component: InternalVersionSegmentationsComponent },
      { path: 'segments', component: SegmentsComponent },
      { path: 'reg-secs', component: RegSecsComponent },
      { path: 'grados', component: GradosComponent },
      { path: 'patenting-versions', component: PatentingVersionsComponent },
      { path: 'wholesale-versions', component: WholeSalesVersionsComponent },
      {
        path: '',
        redirectTo: '/pages/main/catalogs',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogsRoutingModule {}

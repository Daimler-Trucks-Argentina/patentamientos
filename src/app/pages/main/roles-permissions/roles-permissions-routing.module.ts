import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesPermissionsComponent } from './roles-permissions.component';


const routes: Routes = [
  {
    path: '',
    component: RolesPermissionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesPermissionsRoutingModule {}
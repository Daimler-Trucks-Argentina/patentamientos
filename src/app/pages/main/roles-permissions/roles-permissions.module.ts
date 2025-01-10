import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RolesPermissionsComponent } from './roles-permissions.component';
import { RolesPermissionsRoutingModule } from './roles-permissions-routing.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [RolesPermissionsComponent],
  imports: [
    SharedModule,
    RolesPermissionsRoutingModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  providers: [],
})
export class RolesPermissionsModule {}
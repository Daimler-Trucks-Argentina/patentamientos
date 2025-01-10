import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddRoleComponent } from './add-role.component';
import { AddRoleRoutingModule } from './add-role-routing.module';

@NgModule({
  declarations: [AddRoleComponent],
  imports: [
    SharedModule,
    AddRoleRoutingModule,
  ],
  providers: [],
})
export class AddRoleModule {}
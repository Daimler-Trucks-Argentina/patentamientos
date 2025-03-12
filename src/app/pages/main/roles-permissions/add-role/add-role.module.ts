import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddRoleComponent } from './add-role.component';
import { AddRoleRoutingModule } from './add-role-routing.module';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@NgModule({
  declarations: [AddRoleComponent],
  imports: [
    SharedModule,
    AddRoleRoutingModule,
    SpinnerComponent
  ],
  providers: [],
})
export class AddRoleModule {}
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AddUserComponent } from './add-user.component';
import { AddUserRoutingModule } from './add-user-routing.module';
import {MatSelectModule} from '@angular/material/select';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@NgModule({
  declarations: [AddUserComponent],
  imports: [
    SharedModule,
    MatTooltipModule,
    AddUserRoutingModule,
    MatSelectModule,
    SpinnerComponent
  ],
  providers: [],
})
export class AddUserModule {}
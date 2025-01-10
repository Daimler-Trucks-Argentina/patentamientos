import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AddUserComponent } from './add-user.component';
import { AddUserRoutingModule } from './add-user-routing.module';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [AddUserComponent],
  imports: [
    SharedModule,
    MatTooltipModule,
    AddUserRoutingModule,
    MatSelectModule
  ],
  providers: [],
})
export class AddUserModule {}
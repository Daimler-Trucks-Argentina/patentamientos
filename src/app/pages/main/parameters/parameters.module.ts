import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParametersComponent } from './parameters.component';
import { ParametersRoutingModule } from './parameters-routing.module';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [ParametersComponent],
  imports: [
    SharedModule,
    ParametersRoutingModule,
    MatCheckboxModule
  ],
  providers: [],
})
export class ParametersModule {}
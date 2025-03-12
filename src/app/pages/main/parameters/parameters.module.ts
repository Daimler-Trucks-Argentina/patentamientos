import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParametersComponent } from './parameters.component';
import { ParametersRoutingModule } from './parameters-routing.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@NgModule({
  declarations: [ParametersComponent],
  imports: [
    SharedModule,
    ParametersRoutingModule,
    MatCheckboxModule,
    SpinnerComponent
  ],
  providers: [],
})
export class ParametersModule {}
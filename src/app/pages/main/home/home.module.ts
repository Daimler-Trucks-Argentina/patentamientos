import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [HomeRoutingModule, SharedModule,SpinnerComponent],
  providers: [],
})
export class HomeModule {}
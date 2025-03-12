import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, PagesRoutingModule, RouterModule,SpinnerComponent],
})
export class PagesModule {}

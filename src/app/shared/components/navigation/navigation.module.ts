import { NgModule } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { SpinnerComponent } from '../spinner/spinner.component';

@NgModule({
  declarations: [NavigationComponent],
  imports: [SharedModule, MatIconModule, RouterModule, SpinnerComponent],
  exports: [NavigationComponent],
})
export class NavigationModule {}

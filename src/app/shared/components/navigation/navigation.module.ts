import { NgModule } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [NavigationComponent],
  imports: [SharedModule, MatIconModule, RouterModule],
  exports: [NavigationComponent],
})
export class NavigationModule {}

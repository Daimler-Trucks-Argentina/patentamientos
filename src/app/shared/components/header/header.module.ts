import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from '../header/header.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule, SpinnerComponent],
  exports: [HeaderComponent],
  providers: [],
})
export class HeaderModule {}

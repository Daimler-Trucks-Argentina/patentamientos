import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { FileListDialogComponent } from './file-list-dialog/file-list-dialog.component';
import { FileListRoutingModule } from './file-list-routing.module';
import { FileListViewDialogComponent } from './file-list-view-dialog/file-list-view-dialog.component';
import { FileListComponent } from './file-list.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [FileListComponent, FileListDialogComponent, FileListViewDialogComponent],
  imports: [
    FileListRoutingModule,
    SharedModule,
    CommonModule 
  ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }],
})
export class FileListModule {}

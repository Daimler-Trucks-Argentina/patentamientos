import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileListComponent } from './file-list.component';
import { FileListDialogComponent } from './file-list-dialog/file-list-dialog.component';
import { FileListViewDialogComponent } from './file-list-view-dialog/file-list-view-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: FileListComponent,
    children: [
      { path: '', component: FileListDialogComponent },
      { path: '', component: FileListViewDialogComponent },
      {
        path: '',
        redirectTo: '/pages/main/file-list',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileListRoutingModule {}

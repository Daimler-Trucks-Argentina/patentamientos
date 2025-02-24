import { formatDate } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { File } from 'src/app/models/files/file.model';
import { FileService } from 'src/app/services/files/file.service';

export interface DialogData {
  file: File;
}

@Component({
  selector: 'app-file-list-view-dialog',
  templateUrl: './file-list-view-dialog.component.html',
  styleUrls: ['./file-list-view-dialog.component.scss'],
})
export class FileListViewDialogComponent implements OnInit {
  file: File;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<string>();
  csv: string[] = [];
  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fileService: FileService
  ) {
    this.file = data.file;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.fileService.getByFileId(this.data.file.id!).subscribe({
      next: (res: any) => {
        console.log("FILE LIST!",res);
        res.forEach((element: any) => {
          if (element.fecha_De_Inscr) {
            const raw = new Date(element.fecha_De_Inscr);
            element.fecha_De_Inscr = formatDate(raw, 'dd/MM/yyyy', 'en');
          }
        });
        this.displayedColumns = Object.keys(res[0]);
        this.dataSource = new MatTableDataSource<string>(res);
        this.displayedColumns = this.displayedColumns.slice(2, -3);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        console.log(e);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

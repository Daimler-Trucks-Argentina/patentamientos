import { BreakpointObserver, BreakpointState, Breakpoints} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import { v4 as uuidv4 } from 'uuid';
import { TerminalDialogComponent } from './terminal-dialog/terminal-dialog.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-terminals',
  templateUrl: './terminals.component.html',
  styleUrls: ['./terminals.component.scss'],
})
export class TerminalsComponent implements OnInit {
  TAG = TerminalsComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  terminals: Terminal[] = [];
  isXsOrSm = false;
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['id', 'description', 'acciones'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private router: Router,
    private terminalService: TerminalService
  ) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((state: BreakpointState) => {
        console.log(
          `${this.TAG} > ngOnInit > breakpointObserver > state`,
          state
        );
        if (state.matches) {
          this.isXsOrSm = true;
        } else {
          this.isXsOrSm = false;
        }
      });
    this.getData();
  }

  getData(): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([this.terminalService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([terminals]) => {
        console.log(`${this.TAG} > getData > terminals`, terminals);
        terminals.forEach((t) => {
          t.codName = `(${t.mercedesTerminalId}) ${t.name}`;
        });
        this.terminals = terminals;
        this.dataSource = new MatTableDataSource<any>(this.terminals);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`Terminals > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  createOrUpdate(terminalObject?: Terminal) {
    console.log(terminalObject, 'test');

    const dialogRef = this.dialog.open(TerminalDialogComponent, {
      width: this.isXsOrSm ? '90%' : '30%',
      height: this.isXsOrSm ? '80%' : '60%',
      disableClose: true,
      data: {
        terminal: terminalObject ? terminalObject : uuidv4(),
        terminals: this.terminals,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  confirmDelete(terminalObject: Terminal, callback?: any) {
    const terminal = `${terminalObject.name ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar la terminal "${terminal}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(terminalObject.id ?? '');
      }
    );
  }

  delete(terminalId: string): void {
    this.terminalService.deleteCache(terminalId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Terminal eliminada con éxito!',
        });
        this.getData();
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`${this.TAG} > delete > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); 
    this.dataSource.filterPredicate = (data: any): boolean => {
      const searchTerms = filterValue.split(' ');  
      return searchTerms.every(term => {
        const lowerCaseTerm = term.toLowerCase();
        return [
          data.mercedesTerminalId?.toLowerCase().includes(lowerCaseTerm),
          data.description?.toLowerCase().includes(lowerCaseTerm)
        ].some(fieldMatch => fieldMatch);  
      });
    };
  
    this.dataSource.filter = filterValue;  
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

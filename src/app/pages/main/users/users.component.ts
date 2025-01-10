import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { User } from 'src/app/models/users/user.model';
import { UserService } from 'src/app/services/users/user.service';
import { v4 as uuidv4 } from 'uuid';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  TAG = UsersComponent.name;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[];
  users: User[] = [];
  private unsubscribeAll: Subject<any>;
  userEdit: User[] = [];
  dataSource = new MatTableDataSource<any>();
  isLoading = true;

  constructor(
    private router: Router,
    private _userService: UserService,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.displayedColumns = [
      'nombre',
      'apellido',
      'usuario',
      'mail',
      'dni',
      'edit',
    ];
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.isLoading = true;
    const $combineLatest = combineLatest([this._userService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([users]) => {
        this.users = users;
        this.dataSource = new MatTableDataSource<any>(this.users);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`${this.TAG} > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
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

  close() {
    this.router.navigate(['pages/main']);
  }

  createOrUpdateUser(user?: User) {
    this.router.navigate([
      'pages/main/security/users/user',
      { id: user ? user.id : uuidv4() },
    ]);
  }

  confirmDelete(user: User) {
    const userName = `${user.userName ?? '-'}`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar el usuario "${userName}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(user.id ?? '');
      }
    );
  }

  delete(userId: string): void {
    this.isLoading = true;
    this._userService.delete(userId).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: '¡Usuario eliminado con éxito!',
        });
        this.getData();
      },
      error: (err) => {
        console.error(`${this.TAG} > delete > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        this.isLoading = false;
      },
    });
  }
}

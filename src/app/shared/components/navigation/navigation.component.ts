import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { map, Observable, startWith } from 'rxjs';
import { animations } from 'src/app/core/animations/animations';
import { navigation } from './navigation';
import { Navigation, NavigationItem } from './navigation.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { User } from 'src/app/models/users/user.model';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  animations: animations,
})
export class NavigationComponent implements OnInit {
  TAG = 'NavigationComponent';
  @Input() drawer: MatDrawer | undefined;
  navigation = navigation;
  navigationCopy: Navigation[] = JSON.parse(JSON.stringify(navigation));
  isXsOrSm = false;
  formGroup: FormGroup;
  filteredNavigation?: Observable<Navigation[]>;
  user: User;

  constructor(
    public authService: AuthService,
    public breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private router: Router,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.user = this.authService.user!;
    this.formGroup = this.createFormGroup();
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
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      filter: [
        {
          value: null,
          disabled: false,
        },
        [],
      ],
    });
    this.filteredNavigation = formGroup?.get('filter')?.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return typeof value === 'string' ? value : value ? value : '';
      }),
      map((value) => {
        if (value) {
          return this.filterNavigation(value);
        } else {
          const navigationCopy = this.navigationCopy.slice();
          return navigationCopy;
        }
      })
    );
    return formGroup;
  }

  filterNavigation(value: string): Navigation[] {
    const filter = value ? value.toLowerCase() : '';
    return this.navigation.filter((item) => {
      const hasItem = !filter || item.title.toLowerCase().includes(filter);
      let hasAnyChild = false;
      const itemCopy = this.navigationCopy.find((i) => i.id == item.id);
      item.children = itemCopy?.children?.filter((child) => {
        const hasChild = !filter || child.title.toLowerCase().includes(filter);
        if (hasChild) {
          hasAnyChild = true;
        }
        return hasChild;
      });
      if (hasAnyChild) {
        item.collapsed = false;
      }
      return hasItem || hasAnyChild;
    });
  }

  toggle(): void {
    if (this.isXsOrSm) {
      this.drawer?.toggle();
    }
  }

  onNavigationItemClick(item: NavigationItem): void {
    if (item.type === 'collapsable') {
      item.collapsed = !item.collapsed;
    } else {
      this.router.navigate([item.url]);
    }
  }

  get roleId(): string | null {
    return this.authService.user?.roleId ?? null;
  }

  get displayName(): string | null {
    return this.authService.user?.displayName ?? '-';
  }

  editProfile() {
    this.router.navigate([
      'pages/main/profile',
      { id: this.user ? this.user.id : '' },
    ]);
  }

  signOut() {
    this.sweetAlert.question(
      'Confirmación',
      '¿Estás seguro qué deseas cerrar sesión?',
      'Salir',
      'Cancelar',
      () => {
        this.authService.signOut();
      }
    );
  }
}

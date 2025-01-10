import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  TAG = 'MainComponent';
  @Input() drawer: MatDrawer | undefined;
  hasBackdrop = false;
  mode: MatDrawerMode = 'side';
  opened = true;
  showHeader = true;

  constructor(
    private authService: AuthService,
    public breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log(`${this.TAG} > constructor > router.events > event`, event);
        console.log(
          `${this.TAG} > constructor > router.events > event.url`,
          event.url
        );
        if (
          event.url.indexOf('/pages/main/') >= 0 ||
          event.urlAfterRedirects.indexOf('/pages/main/') >= 0
        ) {
          this.authService.refreshToken().subscribe({
            next: (response) => {
              console.log(
                `${this.TAG} > constructor > router.events > refreshToken > response`,
                response
              );
            },
            error: (err) => {
              console.error(
                `${this.TAG} > constructor > router.events > refreshToken > err`,
                err
              );
            },
          });
        }
      });
    this.authService.onDrawerOpenedEmitter.subscribe((opened) => {
      this.opened = opened;
    });
    this.authService.onHeaderEmitter.subscribe((showHeader) => {
      this.showHeader = showHeader;
    });
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.hasBackdrop = true;
          this.mode = 'over';
          this.opened = false;
        } else {
          this.hasBackdrop = false;
          this.mode = 'side';
          this.opened = true;
        }
      });
  }

  onDrawerOpenedChange(opened: boolean): void {
    console.log(`${this.TAG} > onDrawerOpenedChange > opened`, opened);
    this.authService.onDrawerOpenedEmitter.emit(opened);
  }
}

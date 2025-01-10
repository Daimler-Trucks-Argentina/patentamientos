import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCanActivate } from '../core/guards/auth.can-activate';
import { AutoLoginCanActivate } from '../core/guards/auto-login.can-activate';

const routes: Routes = [
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./sign-in/sign-in.module').then((m) => m.SignInModule),
    canActivate: [AutoLoginCanActivate],
  },
  //   {
  //     path: 'set-pwd',
  //     loadChildren: () =>
  //       import('./set-pwd/set-pwd.module').then((m) => m.SetPwdModule),
  //     canActivate: [SetPwdCanActivate],
  //   },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then((m) => m.MainModule),
    canActivate: [AuthCanActivate],
  },
  //   {
  //     path: 'errors',
  //     loadChildren: () =>
  //       import('./errors/errors.module').then((m) => m.ErrorsModule),
  //   },
  {
    path: '',
    redirectTo: '/pages/main/file-list',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

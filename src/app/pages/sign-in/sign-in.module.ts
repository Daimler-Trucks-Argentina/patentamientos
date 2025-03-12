import { NgModule } from '@angular/core';

import { SignInRoutingModule } from './sign-in-routing.module';
import { SignInComponent } from './sign-in.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@NgModule({
  declarations: [SignInComponent],
  imports: [SignInRoutingModule, SharedModule,SpinnerComponent],
  providers: [],
})
export class SignInModule {}

import { NgModule } from '@angular/core';

import { SignInRoutingModule } from './sign-in-routing.module';
import { SignInComponent } from './sign-in.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SignInComponent],
  imports: [SignInRoutingModule, SharedModule],
  providers: [],
})
export class SignInModule {}

import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    SharedModule,
    MatTooltipModule,
    ProfileRoutingModule,
    SpinnerComponent
  ],
  providers: [],
})
export class ProfileModule {}
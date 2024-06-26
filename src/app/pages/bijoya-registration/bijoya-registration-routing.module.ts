import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BijoyaRegistrationComponent } from './bijoya-registration.component';

const routes: Routes = [{ path: '', component: BijoyaRegistrationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BijoyaRegistrationRoutingModule { }

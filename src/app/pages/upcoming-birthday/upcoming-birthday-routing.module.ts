import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpcomingBirthdayComponent } from './upcoming-birthday.component';

const routes: Routes = [{ path: '', component: UpcomingBirthdayComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpcomingBirthdayRoutingModule { }

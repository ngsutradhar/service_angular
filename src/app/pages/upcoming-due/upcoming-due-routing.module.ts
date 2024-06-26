import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpcomingDueComponent } from './upcoming-due.component';

const routes: Routes = [{ path: '', component: UpcomingDueComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpcomingDueRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentdashboardComponent } from './studentdashboard.component';

const routes: Routes = [{ path: '', component: StudentdashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentdashboardRoutingModule { }

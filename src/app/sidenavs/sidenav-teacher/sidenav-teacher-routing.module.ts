import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavTeacherComponent } from './sidenav-teacher.component';

const routes: Routes = [{ path: '', component: SidenavTeacherComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SidenavTeacherRoutingModule { }

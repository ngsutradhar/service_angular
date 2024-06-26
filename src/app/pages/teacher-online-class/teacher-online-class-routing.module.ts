import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherOnlineClassComponent } from './teacher-online-class.component';

const routes: Routes = [{ path: '', component: TeacherOnlineClassComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherOnlineClassRoutingModule { }

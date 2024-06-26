import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherAssignmentComponent } from './teacher-assignment.component';

const routes: Routes = [{ path: '', component: TeacherAssignmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherAssignmentRoutingModule { }

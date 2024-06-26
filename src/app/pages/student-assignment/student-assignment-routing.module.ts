import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentAssignmentComponent } from './student-assignment.component';

const routes: Routes = [{ path: '', component: StudentAssignmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentAssignmentRoutingModule { }

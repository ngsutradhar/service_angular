import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentSyllabusComponent } from './student-syllabus.component';

const routes: Routes = [{ path: '', component: StudentSyllabusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentSyllabusRoutingModule { }

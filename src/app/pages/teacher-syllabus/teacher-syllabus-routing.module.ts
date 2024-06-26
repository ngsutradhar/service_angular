import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherSyllabusComponent } from './teacher-syllabus.component';

const routes: Routes = [{ path: '', component: TeacherSyllabusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherSyllabusRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectToCourseComponent } from './subject-to-course.component';

const routes: Routes = [{ path: '', component: SubjectToCourseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectToCourseRoutingModule { }

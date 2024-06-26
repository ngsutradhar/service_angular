import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseContentProgrammingLanguageComponent } from './course-content-programming-language.component';

const routes: Routes = [{ path: '', component: CourseContentProgrammingLanguageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseContentProgrammingLanguageRoutingModule { }

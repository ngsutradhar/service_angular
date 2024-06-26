import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherQuestionPaperComponent } from './teacher-question-paper.component';

const routes: Routes = [{ path: '', component: TeacherQuestionPaperComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherQuestionPaperRoutingModule { }

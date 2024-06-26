import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentQuestionPaperComponent } from './student-question-paper.component';

const routes: Routes = [{ path: '', component: StudentQuestionPaperComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentQuestionPaperRoutingModule { }

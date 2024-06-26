import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherEbookComponent } from './teacher-ebook.component';

const routes: Routes = [{ path: '', component: TeacherEbookComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherEbookRoutingModule { }

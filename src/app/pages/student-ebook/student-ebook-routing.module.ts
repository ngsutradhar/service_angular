import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentEbookComponent } from './student-ebook.component';

const routes: Routes = [{ path: '', component: StudentEbookComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentEbookRoutingModule { }

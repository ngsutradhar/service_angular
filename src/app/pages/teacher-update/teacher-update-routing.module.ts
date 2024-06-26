import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherUpdateComponent } from './teacher-update.component';

const routes: Routes = [{ path: '', component: TeacherUpdateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherUpdateRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentOnlineClassComponent } from './student-online-class.component';

const routes: Routes = [{ path: '', component: StudentOnlineClassComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentOnlineClassRoutingModule { }

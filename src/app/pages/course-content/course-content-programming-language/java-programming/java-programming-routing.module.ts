import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JavaProgrammingComponent } from './java-programming.component';

const routes: Routes = [{ path: '', component: JavaProgrammingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JavaProgrammingRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { McqClassNineComponent } from './mcq-class-nine.component';

const routes: Routes = [{ path: '', component: McqClassNineComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class McqClassNineRoutingModule { }

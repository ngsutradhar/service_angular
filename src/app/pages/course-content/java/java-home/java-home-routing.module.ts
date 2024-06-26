import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JavaHomeComponent } from './java-home.component';

const routes: Routes = [{ path: '', component: JavaHomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JavaHomeRoutingModule { }

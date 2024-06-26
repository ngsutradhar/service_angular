import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JavaInitialCodingComponent } from './java-initial-coding.component';

const routes: Routes = [{ path: '', component: JavaInitialCodingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JavaInitialCodingRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarksheetComponent } from './marksheet.component';

const routes: Routes = [{ path: '', component: MarksheetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarksheetRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestTableComponent } from './test-table.component';

const routes: Routes = [{ path: '', component: TestTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestTableRoutingModule { }

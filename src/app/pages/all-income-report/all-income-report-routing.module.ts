import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllIncomeReportComponent } from './all-income-report.component';

const routes: Routes = [{ path: '', component: AllIncomeReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllIncomeReportRoutingModule { }

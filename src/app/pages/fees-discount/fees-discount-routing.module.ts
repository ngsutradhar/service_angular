import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeesDiscountComponent } from './fees-discount.component';

const routes: Routes = [{ path: '', component: FeesDiscountComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeesDiscountRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentOnlinePaymentComponent } from './student-online-payment.component';

const routes: Routes = [{ path: '', component: StudentOnlinePaymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentOnlinePaymentRoutingModule { }

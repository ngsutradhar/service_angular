import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdentityCardComponent } from './identity-card.component';

const routes: Routes = [{ path: '', component: IdentityCardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentityCardRoutingModule { }

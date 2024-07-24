import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemToServiceComponent } from './item-to-service.component';

const routes: Routes = [{ path: '', component: ItemToServiceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemToServiceRoutingModule { }

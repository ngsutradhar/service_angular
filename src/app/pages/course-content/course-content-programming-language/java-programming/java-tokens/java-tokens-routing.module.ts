import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JavaTokensComponent } from './java-tokens.component';

const routes: Routes = [{ path: '', component: JavaTokensComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JavaTokensRoutingModule { }

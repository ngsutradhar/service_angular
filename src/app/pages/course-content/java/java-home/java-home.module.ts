import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JavaHomeRoutingModule } from './java-home-routing.module';
import { JavaHomeComponent } from './java-home.component';


@NgModule({
  declarations: [
    JavaHomeComponent
  ],
  imports: [
    CommonModule,
    JavaHomeRoutingModule
  ]
})
export class JavaHomeModule { }

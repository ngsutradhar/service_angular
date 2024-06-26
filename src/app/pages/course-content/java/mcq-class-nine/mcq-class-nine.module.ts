import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { McqClassNineRoutingModule } from './mcq-class-nine-routing.module';
import { McqClassNineComponent } from './mcq-class-nine.component';


@NgModule({
  declarations: [
    McqClassNineComponent
  ],
  imports: [
    CommonModule,
    McqClassNineRoutingModule
  ]
})
export class McqClassNineModule { }

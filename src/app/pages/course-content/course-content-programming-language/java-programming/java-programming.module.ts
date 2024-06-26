import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JavaProgrammingRoutingModule } from './java-programming-routing.module';
import { JavaProgrammingComponent } from './java-programming.component';



@NgModule({
  declarations: [
    JavaProgrammingComponent
  ],
  imports: [
    CommonModule,
    JavaProgrammingRoutingModule
  ]
})
export class JavaProgrammingModule { }

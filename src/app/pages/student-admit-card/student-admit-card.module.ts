import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentAdmitCardRoutingModule } from './student-admit-card-routing.module';
import { StudentAdmitCardComponent } from './student-admit-card.component';


@NgModule({
  declarations: [
    StudentAdmitCardComponent
  ],
  imports: [
    CommonModule,
    StudentAdmitCardRoutingModule
  ]
})
export class StudentAdmitCardModule { }

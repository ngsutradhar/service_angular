import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentdashboardRoutingModule } from './studentdashboard-routing.module';
import { StudentdashboardComponent } from './studentdashboard.component';


@NgModule({
  declarations: [
    StudentdashboardComponent
  ],
  imports: [
    CommonModule,
    StudentdashboardRoutingModule
  ]
})
export class StudentdashboardModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentSyllabusRoutingModule } from './student-syllabus-routing.module';
import { StudentSyllabusComponent } from './student-syllabus.component';


@NgModule({
  declarations: [
    StudentSyllabusComponent
  ],
  imports: [
    CommonModule,
    StudentSyllabusRoutingModule
  ]
})
export class StudentSyllabusModule { }

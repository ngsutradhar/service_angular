import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseContentProgrammingLanguageRoutingModule } from './course-content-programming-language-routing.module';
import { CourseContentProgrammingLanguageComponent } from './course-content-programming-language.component';


@NgModule({
  declarations: [
    CourseContentProgrammingLanguageComponent
  ],
  imports: [
    CommonModule,
    CourseContentProgrammingLanguageRoutingModule
  ]
})
export class CourseContentProgrammingLanguageModule { }

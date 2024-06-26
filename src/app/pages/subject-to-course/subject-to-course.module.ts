import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TableModule} from "primeng/table";
import { ButtonModule } from 'primeng/button';
import {NgSelectModule} from "@ng-select/ng-select";

import { SubjectToCourseRoutingModule } from './subject-to-course-routing.module';
import { SubjectToCourseComponent } from './subject-to-course.component';

import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
  declarations: [
    SubjectToCourseComponent
  ],
  imports: [
    CommonModule,
    SubjectToCourseRoutingModule,
    TableModule,
    ButtonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    InputTextModule

  ]
})
export class SubjectToCourseModule { }

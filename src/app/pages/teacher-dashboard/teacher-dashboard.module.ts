import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherDashboardRoutingModule } from './teacher-dashboard-routing.module';
import { TeacherDashboardComponent } from './teacher-dashboard.component';
import {InputTextModule} from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
@NgModule({
  declarations: [
    TeacherDashboardComponent
  ],
  imports: [
    CommonModule,
    TeacherDashboardRoutingModule,
    InputTextModule,
    TableModule,
    ButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    FontAwesomeModule
  ]
})
export class TeacherDashboardModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentUserRoutingModule } from './student-user-routing.module';
import { StudentUserComponent } from './student-user.component';
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {InputTextModule} from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {NgxPrintModule} from 'ngx-print';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    StudentUserComponent
  ],
  imports: [
    CommonModule,
    StudentUserRoutingModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    InputTextModule,
    TableModule,
    ButtonModule,
    NgxPrintModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class StudentUserModule { }

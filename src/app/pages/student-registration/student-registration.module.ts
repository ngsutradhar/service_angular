import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRegistrationRoutingModule } from './student-registration-routing.module';
import { StudentRegistrationComponent } from './student-registration.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import { ButtonModule } from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {SelectButtonModule} from "primeng/selectbutton";
import {ToggleButtonModule} from "primeng/togglebutton";
import {EditorModule} from "primeng/editor"; 

@NgModule({
  declarations: [
    StudentRegistrationComponent
  ],
  imports: [
    CommonModule,
    StudentRegistrationRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatInputModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SelectButtonModule,
    ToggleButtonModule,
    EditorModule 
  ]
})
export class StudentRegistrationModule { }

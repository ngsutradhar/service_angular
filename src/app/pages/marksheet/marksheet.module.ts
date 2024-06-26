import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarksheetRoutingModule } from './marksheet-routing.module';
import { MarksheetComponent } from './marksheet.component';
import {TableModule} from "primeng/table";
import { ButtonModule } from 'primeng/button';
import {NgSelectModule} from "@ng-select/ng-select";


import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
  declarations: [
    MarksheetComponent
  ],
  imports: [
    CommonModule,
    MarksheetRoutingModule,
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
export class MarksheetModule { }

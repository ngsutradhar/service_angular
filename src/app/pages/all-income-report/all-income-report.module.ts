import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule } from '@angular/forms';

import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule } from '@angular/material/core';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {TableModule} from "primeng/table";
import { ButtonModule } from 'primeng/button';

import {InputTextModule} from 'primeng/inputtext';

import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DropdownModule} from "primeng/dropdown";

import { AllIncomeReportRoutingModule } from './all-income-report-routing.module';
import { AllIncomeReportComponent } from './all-income-report.component';
@NgModule({
  declarations: [
    AllIncomeReportComponent
  ],
  imports: [
    CommonModule,
    AllIncomeReportRoutingModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule

  ]
})
export class AllIncomeReportModule { }

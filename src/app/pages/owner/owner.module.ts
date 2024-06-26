import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { OwnerComponent } from './owner.component';
import { TableModule } from 'primeng/table';
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import { NgChartsModule } from 'ng2-charts';
import {InputTextModule} from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {NgxPrintModule} from 'ngx-print';

import {ToastModule} from "primeng/toast";
import {NgSelectModule} from "@ng-select/ng-select";

import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {StepsModule} from "primeng/steps";
import {PanelModule} from "primeng/panel";
import {DropdownModule} from "primeng/dropdown";



import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';

import {ProgressBarModule} from 'primeng/progressbar';

@NgModule({
  declarations: [
    OwnerComponent
  ],
  imports: [
    CommonModule,
    OwnerRoutingModule,
    TableModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    NgChartsModule,
    InputTextModule,
    ButtonModule,
    NgxPrintModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    ProgressBarModule
  ]
})
export class OwnerModule { }

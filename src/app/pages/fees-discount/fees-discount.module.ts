import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {TableModule} from "primeng/table";
import { ButtonModule } from 'primeng/button';
import {ToastModule} from "primeng/toast";
import {NgSelectModule} from "@ng-select/ng-select";



import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { FeesDiscountRoutingModule } from './fees-discount-routing.module';
import { FeesDiscountComponent } from './fees-discount.component';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
  declarations: [
    FeesDiscountComponent
  ],
  imports: [
    CommonModule,
    FeesDiscountRoutingModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    TableModule,
    ButtonModule,
    ToastModule,
    NgSelectModule,
    ConfirmDialogModule,
    DialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    InputTextModule
  ]
})
export class FeesDiscountModule { }

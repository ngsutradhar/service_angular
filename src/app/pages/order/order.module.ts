import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';

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
import {MatNativeDateModule } from '@angular/material/core';
import {SelectButtonModule} from "primeng/selectbutton";
import {ToggleButtonModule} from "primeng/togglebutton";
import {EditorModule} from "primeng/editor"; 

import {MatCardModule} from "@angular/material/card";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';

import {} from 'primeng/inputtext';
@NgModule({
  declarations: [
    OrderComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
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
    EditorModule,
    MatCardModule,
    ConfirmDialogModule,
    DialogModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class OrderModule { }

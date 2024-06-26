import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoRoutingModule } from './demo-routing.module';
import { DemoComponent } from './demo.component';

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

@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [
    CommonModule,
    DemoRoutingModule,
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
    InputTextModule
  ]
})
export class DemoModule { }

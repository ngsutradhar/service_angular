import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeveloperRoutingModule } from './developer-routing.module';
import { DeveloperComponent } from './developer.component';

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

@NgModule({
  declarations: [
    DeveloperComponent
  ],
  imports: [
    CommonModule,
    DeveloperRoutingModule,
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
    ButtonModule
  ]
})
export class DeveloperModule { }

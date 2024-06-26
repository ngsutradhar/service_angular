import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpcomingDueRoutingModule } from './upcoming-due-routing.module';
import { UpcomingDueComponent } from './upcoming-due.component';
import { TableModule } from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    UpcomingDueComponent
  ],
  imports: [
    CommonModule,
    UpcomingDueRoutingModule,
    TableModule,
    InputTextModule,
    ButtonModule
  ]
})
export class UpcomingDueModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpcomingBirthdayRoutingModule } from './upcoming-birthday-routing.module';
import { UpcomingBirthdayComponent } from './upcoming-birthday.component';
import { TableModule } from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    UpcomingBirthdayComponent
  ],
  imports: [
    CommonModule,
    UpcomingBirthdayRoutingModule,
    TableModule,
    InputTextModule,
    ButtonModule
  ]
})
export class UpcomingBirthdayModule { }

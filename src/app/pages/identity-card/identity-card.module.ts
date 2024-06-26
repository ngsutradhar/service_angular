import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdentityCardRoutingModule } from './identity-card-routing.module';
import { IdentityCardComponent } from './identity-card.component';
import {InputTextModule} from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  declarations: [
    IdentityCardComponent
  ],
  imports: [
    CommonModule,
    IdentityCardRoutingModule,
    InputTextModule,
    ButtonModule,
    NgxPrintModule
  ]
})
export class IdentityCardModule { }

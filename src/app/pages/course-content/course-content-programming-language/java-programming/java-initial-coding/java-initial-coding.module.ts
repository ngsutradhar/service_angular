import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JavaInitialCodingRoutingModule } from './java-initial-coding-routing.module';
import { JavaInitialCodingComponent } from './java-initial-coding.component';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TooltipModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    JavaInitialCodingComponent
  ],
  imports: [
    CommonModule,
    JavaInitialCodingRoutingModule,
    AccordionModule,
    ToastModule,
    ButtonModule,
    FieldsetModule,
    DividerModule,
    CardModule,
    TooltipModule
  ]
})
export class JavaInitialCodingModule { }

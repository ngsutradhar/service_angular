import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JavaTokensRoutingModule } from './java-tokens-routing.module';
import { JavaTokensComponent } from './java-tokens.component';
import {AccordionModule} from "primeng/accordion";
import {ToastModule} from "primeng/toast";
import {ButtonModule} from "primeng/button";
import {FieldsetModule} from "primeng/fieldset";
import {DividerModule} from "primeng/divider";
import {CardModule} from "primeng/card";
import {TooltipModule} from "@swimlane/ngx-charts";



@NgModule({
  declarations: [
    JavaTokensComponent
  ],
  imports: [
    CommonModule,
    JavaTokensRoutingModule,
    AccordionModule,
    ToastModule,
    ButtonModule,
    FieldsetModule,
    DividerModule,
    CardModule,
    TooltipModule

  ]
})
export class JavaTokensModule { }

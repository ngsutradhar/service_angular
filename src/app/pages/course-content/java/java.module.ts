import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JavaRoutingModule } from './java-routing.module';
import { JavaComponent } from './java.component';
import {ImageModule} from "primeng/image";
import {ButtonModule} from "primeng/button";
import {PanelMenuModule} from "primeng/panelmenu";


@NgModule({
  declarations: [
    JavaComponent
  ],
  imports: [
    CommonModule,
    JavaRoutingModule,
    ImageModule,
    ButtonModule,
    PanelMenuModule
  ]
})
export class JavaModule { }

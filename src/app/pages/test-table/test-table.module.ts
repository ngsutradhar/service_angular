import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestTableRoutingModule } from './test-table-routing.module';
import { TestTableComponent } from './test-table.component';
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [
    TestTableComponent
  ],
  imports: [
    CommonModule,
    TestTableRoutingModule,
    MatIconModule,
    MatTableModule
  ]
})
export class TestTableModule { }

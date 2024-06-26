import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidenavTeacherRoutingModule } from './sidenav-teacher-routing.module';
import { SidenavTeacherComponent } from './sidenav-teacher.component';

import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
@NgModule({
  declarations: [
    SidenavTeacherComponent
  ],
  exports: [
    SidenavTeacherComponent
  ],
  imports: [
    CommonModule,
    SidenavTeacherRoutingModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    FontAwesomeModule
  ]
})
export class SidenavTeacherModule { }

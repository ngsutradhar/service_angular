import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectsRoutingModule } from './subjects-routing.module';
import { SubjectsComponent } from './subjects.component';

import {TableModule} from "primeng/table";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatStepperModule} from "@angular/material/stepper";
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import {EditorModule} from "primeng/editor";
import {MatButtonModule} from "@angular/material/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {StepsModule} from "primeng/steps";
import {PanelModule} from "primeng/panel";
import {DropdownModule} from "primeng/dropdown";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {SelectButtonModule} from "primeng/selectbutton";
import {ToggleButtonModule} from "primeng/togglebutton";
import {TooltipModule} from "primeng/tooltip";
import {SidebarModule} from "primeng/sidebar";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {InputTextModule} from 'primeng/inputtext';
@NgModule({
  declarations: [
    SubjectsComponent
  ],
  imports: [
    CommonModule,
    SubjectsRoutingModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    ButtonModule,
    RippleModule,
    EditorModule,
    TableModule,
    MatButtonModule,
    ConfirmDialogModule,
    DialogModule,
    StepsModule,
    PanelModule,
    DropdownModule,
    NgSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SelectButtonModule,
    ToggleButtonModule,
    TooltipModule,
    SidebarModule,
    NgbModule,
    MatAutocompleteModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    InputTextModule,
    MatFormFieldModule
  ]
})
export class SubjectsModule { }

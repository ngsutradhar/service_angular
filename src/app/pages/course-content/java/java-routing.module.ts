import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JavaComponent } from './java.component';
import {CourseContentComponent} from "../course-content.component";
import {JavaHomeComponent} from "./java-home/java-home.component";

// const routes: Routes = [{ path: '', component: JavaComponent }];
const routes: Routes = [
  { path: '',
    component: JavaComponent,
    children: [
      { path: '', component: JavaHomeComponent },
      { path: 'McqClassNine', loadChildren: () => import('./mcq-class-nine/mcq-class-nine.module').then(m => m.McqClassNineModule) },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JavaRoutingModule { }

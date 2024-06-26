import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {StudentService} from "../services/student.service";
import {forkJoin} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StudentResolver implements Resolve<boolean> {
  organisationId: number =0;
  constructor(private studentService: StudentService ){
    const user = localStorage.getItem('user');
    if (user){
      //this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user organisationId:",(this.organisationId));
    }
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    // const a = this.jobTaskService.getAll();
    const b = this.studentService.fetchAllStudents(this.organisationId);
    const c = this.studentService.fetchAllStates();
    const join = forkJoin(b,c).pipe(map((allResponses) => {
      return {
        students: allResponses[0],
        states: allResponses[1]
      };
    }));
    return join;
  }
}

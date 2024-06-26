import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { map,forkJoin, Observable, of } from 'rxjs';
import {StudentService} from "../services/student.service";
import {CourseService} from "../services/course.service";
import {StudentToCourseService} from "../services/student-to-course.service";
import {TransactionServicesService} from "../services/transaction-services.service";
@Injectable({
  providedIn: 'root'
})
export class FeesReceivedResolver implements Resolve<any> {
  organisationId: number =0;
  constructor(private transactionServicesService: TransactionServicesService ){
    const user = localStorage.getItem('user');
    if (user){
      //this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user organisationId:",(this.organisationId));
    }
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const b = this.transactionServicesService.fetchAllStudentName(this.organisationId);
    const c = this.transactionServicesService.fetchAllFeesName();
    // const c = this.courseService.fetchAllDurationType();
    // const d = this.courseService.fetchAllCourses();
    // const e = this.studentToCourseServices.fetchAllStudentToCourses();
    const join = forkJoin(b,c).pipe(map((allResponses: any[]) => {
      return {
        students: allResponses[0],
        feesNames: allResponses[1]
      };
    }));
    return join;
  }
}

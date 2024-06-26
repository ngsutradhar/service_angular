import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { map,forkJoin, Observable, of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { StudentToCourseService } from '../services/student-to-course.service';
import { StudentService } from '../services/student.service';

@Injectable({
  providedIn: 'root'
})
export class StudentCourseRegistrationResolver implements Resolve<boolean> {
  organisationId: number =0;
  constructor(private studentService: StudentService,
    private courseService: CourseService,
    private studentToCourseServices: StudentToCourseService ){
    
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
    const c = this.courseService.fetchAllDurationType();
    const d = this.courseService.fetchAllCourses(this.organisationId);
    const e = this.studentToCourseServices.fetchAllStudentToCourses(this.organisationId);
    console.log("fsadafsdf",e);
    const join = forkJoin(b,c,d,e).pipe(map((allResponses: any[]) => {
      return {
        students: allResponses[0],
        durationTypes: allResponses[1],
        courses: allResponses[2],
        studentTocourses: allResponses[3]
      };
    }));
    return join;
  }
}

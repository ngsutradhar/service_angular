import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { BijoyaRegistration } from '../models/bijoya-regitration.model';
import { CommonService } from './common.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class BijoyaRegistrationService {
  studentInfo: BijoyaRegistration[]=[];

  constructor( private http: HttpClient, private commonService: CommonService,  private errorService: ErrorService,) {

  }

  saveStudentInfo(studentData: any){
    return this.http.post<any>(this.commonService.getAPI() + '/dev/bijoyaRegistrationForm', studentData)
    .pipe(catchError(this.errorService.serverError), tap(response =>{
      // console.log(response);
    }))
  }

  fetchAllStudentInfo(){
    return this.http.get<any>(this.commonService.getAPI() + '/dev/bijoyaRegistrationForm')
    .pipe(catchError(this.errorService.serverError),tap(response =>{
      // this.studentInfo = response.data;
    }));
  }

  // fetchAllCourses(){
  //   return this.http.get<any>(this.commonService.getAPI() + '/courses')
  //   .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Course[]}) => {
  //     this.courseList=response.data;
  //     /* console.log("courseList:",this.courseList); */
  //     this.courseSubject.next([...this.courseList]);
  //   })));
  // }

  
}

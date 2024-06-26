import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { Course } from '../models/course.model';
import { CommonService } from './common.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  courseList: Course[] =[];
  subjectList: any[] =[];
  durationTypeList: any[] =[];
  courseSubject = new Subject<Course[]>();
  durationTypeSubject = new Subject<Course[]>();
  constructor(private commonService: CommonService, private errorService: ErrorService, private http: HttpClient) { }
  //$orgID=1;

  fetchAllSubject($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/subjects/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Course[]}) => {
      this.subjectList=response.data;
       console.log("courseList:",this.subjectList); 
      })));
  }
  uploadData(data:any){
    const headers=new HttpHeaders();
    return this.http.post<any>(this.commonService.getAPI() + '/fileUpload', data,{
      headers:headers
    }).pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service image:',response);
      if (response.success === 1){
        this.courseList.unshift(response.data);
        this.durationTypeSubject.next([...this.courseList]);
      }
    }))
  }

  syllabusUploadSave(data:any){
    const headers=new HttpHeaders();
    return this.http.post<any>(this.commonService.getAPI() + '/syllabusUpload', data,{
      headers:headers
    }).pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service image:',response);
      if (response.success === 1){
        this.courseList.unshift(response.data);
        this.durationTypeSubject.next([...this.courseList]);
      }
    }))
  }
  ebookUploadSave(data:any){
    const headers=new HttpHeaders();
    return this.http.post<any>(this.commonService.getAPI() + '/ebookUpload', data,{
      headers:headers
    }).pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service image:',response);
      if (response.success === 1){
        this.courseList.unshift(response.data);
        this.durationTypeSubject.next([...this.courseList]);
      }
    }))
  }
  questionUploadSave(data:any){
    const headers=new HttpHeaders();
    return this.http.post<any>(this.commonService.getAPI() + '/questionUpload', data,{
      headers:headers
    }).pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service image:',response);
      if (response.success === 1){
        this.courseList.unshift(response.data);
        this.durationTypeSubject.next([...this.courseList]);
      }
    }))
  }
  assignmentUploadSave(data:any){
    const headers=new HttpHeaders();
    return this.http.post<any>(this.commonService.getAPI() + '/assignmentUpload', data,{
      headers:headers
    }).pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service image:',response);
      if (response.success === 1){
        this.courseList.unshift(response.data);
        this.durationTypeSubject.next([...this.courseList]);
      }
    }))
  }
  saveOnlineClass(data:any){
    this.subjectList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/saveOnlineClass', data)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at subject',response);
      if (response.status === true){
        this.subjectList.unshift(response.data);
        this.durationTypeSubject.next([...this.subjectList]);
      }
    }))
  }
  saveSubject(data:any){
    this.subjectList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/subject', data)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at subject',response);
      if (response.status === true){
        this.subjectList.unshift(response.data);
        this.durationTypeSubject.next([...this.subjectList]);
      }
    }))
  }
  saveSubjectToCourse(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/saveSubjectToCourse', data)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.courseList.unshift(response.data);
        this.durationTypeSubject.next([...this.courseList]);
      }
    }))
  }

   fetchAllCourses($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/courses/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Course[]}) => {
      this.courseList=response.data;
       console.log("courseList:",this.courseList); 
      this.courseSubject.next([...this.courseList]);
    })));
  }
  fetchAllSubjects($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/subjects/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Course[]}) => {
      this.subjectList=response.data;
       console.log("subjectList:",this.subjectList); 
      })));
  }
  getCourses(){
    return [...this.courseList];
  }
  getCourseUpdateListener(){
    return this.courseSubject.asObservable();
  }

  fetchAllDurationType(){
    return this.http.get<any>(this.commonService.getAPI() + '/durationTypes')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.durationTypeList=response.data;
      this.durationTypeSubject.next([...this.durationTypeList]);
    })));
  }

  saveCourse(coursetData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/courses', coursetData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.courseList.unshift(response.data);
        this.durationTypeSubject.next([...this.courseList]);
      }
    }))
  }
  deleteCourse(id:any){
    console.log("service id:",id);
    //return 0;
    return this.http.delete<any>(this.commonService.getAPI() + '/courses/'+ id)
    .pipe(catchError(this.errorService.serverError), tap(response => {  
     
    }))
  }
  updateCourse(coursetData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/courses', coursetData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.courseList.unshift(response.data);
        this.durationTypeSubject.next([...this.courseList]);
      }
    }))
  }
  fetchAllTotalCourse($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/coursesTotal/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any}) => {
      this.courseList=response.data;
      this.durationTypeSubject.next([...this.courseList]);
    })));
  }
  fetchLastCourse($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/lastCourse/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any}) => {
      this.courseList=response.data;
      this.durationTypeSubject.next([...this.courseList]);
    })));
  }
  fetchMonthlyTotalCourse($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/coursesMonthly/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any}) => {
      this.courseList=response.data;
      this.durationTypeSubject.next([...this.courseList]);
    })));
  }
  fetchFullTotalCourse($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/coursesFull/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any}) => {
      this.courseList=response.data;
      this.durationTypeSubject.next([...this.courseList]);
    })));
  }
}

import { Injectable } from '@angular/core';
import {Student} from "../models/student.model";
import {CommonService} from "./common.service";
import {ErrorService} from "./error.service";
import {catchError, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {of} from "rxjs";
import { Organisation } from '../models/organisation.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  organisationList: Organisation[] =[];
  organisationListArray: Organisation[] =[];
  studentListArray: any[] =[];
  stateList: any[] =[];
  organisationSubject = new Subject<Organisation[]>();
  constructor(private commonService: CommonService, private errorService: ErrorService, private http: HttpClient) { }

  saveDemoOrganisation(orgData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/organisationDemoSave', orgData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === 1){
        this.organisationList.unshift(response.data);
        this.organisationSubject.next([...this.organisationList]);
      }
    }))
  }
  saveOrganisation(orgData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/organisationSave', orgData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === 1){
        this.organisationList.unshift(response.data);
        this.organisationSubject.next([...this.organisationList]);
      }
    }))
  }
  updateOrganisation(orgData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/organisationUpdate', orgData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === 1){
        this.organisationList.unshift(response.data);
        this.organisationSubject.next([...this.organisationList]);
      }
    }))
  }
  fetchAllOrganisation(){
    return this.http.get<any>(this.commonService.getAPI() + '/getAllorganisation')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Organisation[]}) => {
      this.organisationListArray=response.data;
      console.log("Student to courseList:",this.organisationListArray); 
      this.organisationSubject.next([...this.organisationListArray]);
    })));
  }
  fetchAllStudentName(){
    return this.http.get<any>(this.commonService.getAPI() + '/getAllstudent')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Organisation[]}) => {
      this.studentListArray=response.data;
      console.log("Student to courseList:",this.studentListArray); 
      this.organisationSubject.next([...this.studentListArray]);
    })));
  }
  fetchOrganisationById($id:any){
    return this.http.get<any>(this.commonService.getAPI() + '/getOrganisationById/'+ $id)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Organisation[]}) => {
      this.organisationListArray=response.data;
      console.log("Student to courseList:",this.organisationListArray); 
      this.organisationSubject.next([...this.organisationListArray]);
    })));
  }
}

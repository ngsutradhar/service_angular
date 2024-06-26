import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Subject } from 'rxjs/internal/Subject';
import { tap } from 'rxjs';
import { StudentToCourse } from '../models/studenttocourse.model';
import { CommonService } from './common.service';
import { ErrorService } from './error.service';
@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  feesFeesChargedList:any[]=[];
  feesFeesReceivedList:any[]=[];
  incomeReportListDeveloper:any[]=[];

  studentToCourseSubject = new Subject<StudentToCourse[]>();
  feesNameSubject = new Subject<any[]>();
  studentNameSubject = new Subject<any[]>();
  feesReceivedSubject = new Subject<any[]>();
  feesFeesChargedSubject = new Subject<any[]>();
  transactionListSubject = new Subject<any[]>();
  incomeReportSubjectDeveloper = new Subject<any[]>();
  constructor(private commonService: CommonService, private errorService: ErrorService, private http: HttpClient) { }

  fetchAllFeesChargedDeveloperDelete($id:any){
    this.feesFeesChargedList=[];
    return this.http.delete<any>(this.commonService.getAPI() + '/deleteTransaction/'+$id)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesFeesChargedList=response.data;
      this.feesFeesChargedSubject.next([...this.feesFeesChargedList]);
    })));
  }

  deleteAllTransactionByStudentRegistrationId($id:any){
    this.feesFeesChargedList=[];
    return this.http.delete<any>(this.commonService.getAPI() + '/deleteStudentToCourse/'+$id)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesFeesChargedList=response.data;
      this.feesFeesChargedSubject.next([...this.feesFeesChargedList]);
    })));
  }
  fetchAllFeesReceivedDeveloper(){
    this.feesFeesReceivedList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/allFeesReceivedDeveloper')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesFeesReceivedList=response.data;
      this.feesFeesChargedSubject.next([...this.feesFeesReceivedList]);
    })));
  }

  fetchAllFeesChargedDeveloper(){
    this.feesFeesChargedList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/allFeesChargedDeveloper')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesFeesChargedList=response.data;
      this.feesFeesChargedSubject.next([...this.feesFeesChargedList]);
    })));
  }
  fetchAllOrgDetailsDeveloper(){
    this.feesFeesChargedList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/allOrgDetails')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesFeesChargedList=response.data;
      this.feesFeesChargedSubject.next([...this.feesFeesChargedList]);
    })));
  }
  fetchAllIncomeReportDeveloper(){
    this.incomeReportListDeveloper=[];
    return this.http.get<any>(this.commonService.getAPI() + '/allOrgIncome')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.incomeReportListDeveloper=response.data;
      this.incomeReportSubjectDeveloper.next([...this.incomeReportListDeveloper]);
      console.log("all Income:",this.incomeReportListDeveloper);
    })));
  }

  fetchTotalOrganisation(){
    this.incomeReportListDeveloper=[];
    return this.http.get<any>(this.commonService.getAPI() + '/organisationCount')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.incomeReportListDeveloper=response.data;
      this.incomeReportSubjectDeveloper.next([...this.incomeReportListDeveloper]);
      console.log("TotalOrganisation:",this.incomeReportListDeveloper);
    })));
  }

  fetchTotalStudent(){
    this.incomeReportListDeveloper=[];
    return this.http.get<any>(this.commonService.getAPI() + '/studentCount')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.incomeReportListDeveloper=response.data;
      this.incomeReportSubjectDeveloper.next([...this.incomeReportListDeveloper]);
      console.log("TotalStudent:",this.incomeReportListDeveloper);
    })));
  }

 
}

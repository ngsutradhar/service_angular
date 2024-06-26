import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, Subject, throwError} from 'rxjs';
import {Router} from '@angular/router';
// global.ts file is created in shared folder to store all global variables.
import {User} from '../models/user.model';
import {environment} from '../../environments/environment';
import {ErrorService} from './error.service';
import {CommonService} from "./common.service";
import { Observable } from 'rxjs';

export interface AuthResponseData {
  status: boolean;
  message: string;
  data: {
    uniqueId: number;
    userName: string;
    userTypeId: number;
    userTypeName: string;
    organisationId:number;
    employeeId:number;
    token: string;
  };
}


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class AuthService {
  private BASE_API_URL = environment.BASE_API_URL;
  userRegisterArray:any[]=[];
  newsDataList:any[]=[];
  userRegisterSubject = new Subject<any[]>();
  // @ts-ignore
  userBehaviorSubject = new BehaviorSubject<User>(null);
  constructor(private commonService: CommonService , private  http: HttpClient, private router: Router, private errorService: ErrorService) { }
  fetchStudents() {
    return this.http.get<any>('assets/students.json')
      .toPromise()
      .then(res => <any[]>res.data)
      .then(data => { return data; });
  }

  getUserBehaviorSubjectListener(){
    return this.userBehaviorSubject;
  }
  isAuthenticated(){
    if (this.userBehaviorSubject.value){
      return true;
    }else{
      return false;
    }
  }
  isNotAuthenticated(){
    if (this.userBehaviorSubject.value){
      return false;
    }else{
      return true;
    }
  }
  isOwner(){
    if (this.userBehaviorSubject.value && this.userBehaviorSubject.value.isOwner){
      return true;
    }else{
      return false;
    }
  }
  isDeveloper(): boolean{
    if (this.userBehaviorSubject.value && this.userBehaviorSubject.value.isDeveloper){
      return true;
    }else{
      return false;
    }
  }
  isManagerSales(): boolean{
    if (this.userBehaviorSubject.value && this.userBehaviorSubject.value.isManagerSales){
      return true;
    }else{
      return false;
    }
  }


  isOfficeStaff(): boolean{
    if (this.userBehaviorSubject.value && this.userBehaviorSubject.value.isOfficeStaff){
      return true;
    }else{
      return false;
    }
  }

  isStudent(): boolean{
    if (this.userBehaviorSubject.value && this.userBehaviorSubject.value.isStudent){
      return true;
    }else{
      return false;
    }
  }



  isTutorial(): boolean{
    if (this.userBehaviorSubject.value && this.userBehaviorSubject.value.isTutorial){
      return true;
    }else{
      return false;
    }
  }

  getUserName(): string{
    if (this.userBehaviorSubject.value){
      //console.log("user name:",this.userBehaviorSubject.value.userName);
      return this.userBehaviorSubject.value.userName;
      
    }
    return "";
  }


  autoLogin(){
    const userData: User = JSON.parse(<string>localStorage.getItem('user'));
    if (!userData){
      return;
    }
    const loadedUser = new User(userData.uniqueId, userData.userName, userData._authKey, userData.userTypeId,userData.userTypeName,userData.organisationId,userData.employeeId);
    if (loadedUser.authKey){
      this.userBehaviorSubject.next(loadedUser);
    }
  }

  changePasswordUser(userData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/changePassword', userData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === 1){
        this.userRegisterArray.unshift(response.data);
        this.userRegisterSubject.next([...this.userRegisterArray]);
      }
    }))
  }
  updateUser(userData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/userUpdate', userData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === 1){
        this.userRegisterArray.unshift(response.data);
        this.userRegisterSubject.next([...this.userRegisterArray]);
      }
    }))
  }
  fetchProfileImage($orgID:any,$ledgerID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/getProfileImage/'+$orgID +'/'+$ledgerID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.newsDataList=response.data;
      })));
  }
  saveUser(userData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/register', userData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === 1){
        this.userRegisterArray.unshift(response.data);
        this.userRegisterSubject.next([...this.userRegisterArray]);
      }
    }))
  }
  loginTutorial(loginData: any){
    const user = new User(0,
      loginData.userName,
      'not required',
      100,
      'tutorial',
      1,
      0);
    this.userBehaviorSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(loginData: any){
    return this.http.post<AuthResponseData>(this.commonService.getAPI() + '/login', loginData)
        .pipe(catchError(this.errorService.serverError), tap(resData => {
          // tslint:disable-next-line:max-line-length
          if (resData.status === true){
            const user = new User(resData.data.uniqueId,
                resData.data.userName,
                resData.data.token,
                resData.data.userTypeId,
                resData.data.userTypeName,
                resData.data.organisationId,
                resData.data.employeeId
                          );
            this.userBehaviorSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));
          }
        }));  // this.handleError is a method created by me
  }


  private serverError(err: any) {
    if (err instanceof Response) {
      return throwError('backend server error ');
      // if you're using lite-server, use the following line
      // instead of the line above:
      // return Observable.throw(err.text() || 'backend server error');
    }
    if (err.status === 0){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
    }
    if (err.status === 401){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Your are not authorised', statusText: err.statusText});
    }
    return throwError(err);
  }
  private handleError(errorResponse: HttpErrorResponse){
    if (errorResponse.error.message.includes('1062')){
      return throwError('Record already exists');
    }else {
      return throwError(errorResponse.error.message);
    }
  }

  redirectToRoot(){
    this.router.navigate(['/']).then(r => {
      if (r) {
        location.reload();
      }
    });
  }

  logout(){
    this.http.get<any>(this.commonService.getAPI() + '/logout').subscribe( response => {
      // this.userBehaviorSubject.next(null);
      localStorage.removeItem('user');
      this.router.navigate(['/']).then(r => {
        if (r) {
          location.reload();
        }
      });
      }, (error) => {
        console.log('logout with error', error);
        // this.userBehaviorSubject.next(null);
        localStorage.removeItem('user');
        this.router.navigate(['/']).then(r => {
          if (r) {
            location.reload();
          }
        });
    });

  }

  fetchAllUserType(){
    return this.http.get<any>(this.commonService.getAPI() + '/getAllUserTypes')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.userRegisterArray=response.data;
      /* console.log("courseList:",this.courseList); */
      this.userRegisterSubject.next([...this.userRegisterArray]);
    })));
  }
  fetchAllUserList(){
    return this.http.get<any>(this.commonService.getAPI() + '/getAllUserList')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.userRegisterArray=response.data;
      console.log("Student to courseList:",this.userRegisterArray); 
      this.userRegisterSubject.next([...this.userRegisterArray]);
    })));
  }
  fetchProfileImageList(){
    return this.http.get<any>(this.commonService.getAPI() + '/getProfileImage')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.userRegisterArray=response.data;
      console.log("Student to courseList:",this.userRegisterArray); 
      this.userRegisterSubject.next([...this.userRegisterArray]);
    })));
  }
    logoutAll() {
      // this.userBehaviorSubject.next(null);
      // localStorage.removeItem('user');
      this.http.get<any>(this.commonService.getAPI() + '/revokeAll').subscribe( response => {
        // this.userBehaviorSubject.next(null);
        localStorage.removeItem('user');
        this.router.navigate(['/']).then(r => {
          if (r) {
            location.reload();
          }
        });
      }, (error) => {
        console.log('logout with error', error);
        // this.userBehaviorSubject.next(null);
        localStorage.removeItem('user');
        this.router.navigate(['/']).then(r => {
          if (r) {
            location.reload();
          }
        });
      });
    }
    
    upload(data: any): Observable<any> {
      const headers=new HttpHeaders();
      return this.http.post<any>(this.commonService.getAPI() + '/uploadPicture', data,{
        headers:headers
      }).pipe(catchError(this.errorService.serverError), tap(response => {
        console.log('at service image:',response);
        if (response.success === 1){
         /*  this.courseList.unshift(response.data);
          this.durationTypeSubject.next([...this.courseList]); */
        }
      }))
      // Create form data
      const formData = new FormData();
  
      // Store form name as "file" with file data
      // @ts-ignore
      formData.append('file', file);
      formData.append('filename', 'profile_pic_' + JSON.parse(<string>localStorage.getItem('user')).uniqueId + '.jpeg');
      // Make http post request over api
      // with formData as req
      // return this.http.post('http://127.0.0.1/gold_project/new_gold_api/public/api/uploadPicture', formData);
      return this.http.post(this.commonService.getAPI() + '/uploadPicture', formData);
    }
  upload_orginal(file: string | Blob | undefined): Observable<any> {

    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    // @ts-ignore
    formData.append('file', file);
    formData.append('filename', 'profile_pic_' + JSON.parse(<string>localStorage.getItem('user')).uniqueId + '.jpeg');
    // Make http post request over api
    // with formData as req
    // return this.http.post('http://127.0.0.1/gold_project/new_gold_api/public/api/uploadPicture', formData);
    return this.http.post(this.commonService.getAPI() + '/uploadPicture', formData);
  }
  uploadStudentImage(file: string | Blob | undefined): Observable<any> {

    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    // @ts-ignore
    formData.append('file', file);
    formData.append('filename', 'student_pic_' + 'current' + '.jpeg');
    // Make http post request over api
    // with formData as req
    // return this.http.post('http://127.0.0.1/gold_project/new_gold_api/public/api/uploadPicture', formData);
    return this.http.post(this.commonService.getAPI() + '/uploadStudentPicture', formData);
  }
}

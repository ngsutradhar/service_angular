import { Injectable } from '@angular/core';
import {Student} from "../models/student.model";
import {CommonService} from "./common.service";
import {ErrorService} from "./error.service";
import {catchError, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {of} from "rxjs";

class CommerService {
}

export interface StudentResponseData {
  status: boolean;
  message: string;
  $orgID:number;
  
  data: {
    studentId: number;
		episodeId: string;
		studentName:string;
		billingName: string;
		fatherName: string;
		motherName: string;
		guardianName: string;
		relationToGuardian: string;
		dob: string;
		sex: string;
		address: string;
		city: string;
		district: string;
		stateId: number;
		pin: number,
  };
  error?: any;
}
function _window() : any {
  return window;
}
@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  studentList: Student[] =[];
  teacherList: Student[] =[];
  stateList: any[] =[];
  success:number=0;
  studentSubject = new Subject<Student[]>();
  stateSubject = new Subject<Student[]>();
  get nativeWindow() : any {
    return _window();
 }
  constructor(private commonService: CommonService, private errorService: ErrorService, private http: HttpClient) { }

  /* fetchEducations() {
    return this.http.get<any>('assets/educations.json')
      .toPromise()
      .then(res => <any[]>res.data)
      .then(data => { return data; });
  } */
  
  //$orgID=1;
  deleteStudentInactive($id:any){
    this.studentList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/students/deleteInactiveStudent/'+ $id)
   .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Student[]}) => {
    /*  this.studentList=response.data;
     this.studentSubject.next([...this.studentList]); */
   })));
  }
  fetchCheckStudentExists($data:any){
    this.studentList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/studentExists/'+ $data)
   .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Student[]}) => {
     this.studentList=response.data;
     this.studentSubject.next([...this.studentList]);
   })));
  }

  updateStudentInforce($studentID:any){
    this.studentList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/students/updateStudentInforce/'+ $studentID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Student[]}) => {
      this.success=response.success;
      this.studentList=response.data;
      //this.studentSubject.next([...this.studentList]);
    })));
  }

  fetchAllInactiveStudents($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/students/inactiveStudentList/'+ $orgID)
   .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Student[]}) => {
     this.studentList=response.data;
     this.studentSubject.next([...this.studentList]);
   })));
}
  fetchAllEmployee($orgID:any){
       return this.http.get<any>(this.commonService.getAPI() + '/getAllEmployeeList/'+ $orgID)
      .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Student[]}) => {
        this.studentList=response.data;
        this.studentSubject.next([...this.studentList]);
      })));
  }
  fetchAllStudentByOrdID($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/students/studentByOrgId/'+ $orgID)
   .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Student[]}) => {
     this.studentList=response.data;
     this.studentSubject.next([...this.studentList]);
   })));
}
  fetchAllCustomer($orgID:any){
    this.teacherList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/getAllCustomerList/'+ $orgID)
   .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
     this.teacherList=response.data;
     this.studentSubject.next([...this.teacherList]);
   })));
}
fetchAllItemToService($orgID:any){
  this.teacherList=[];
  return this.http.get<any>(this.commonService.getAPI() + '/getAllItemToServiceList/'+ $orgID)
.pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
  this.teacherList=response.data;
  this.studentSubject.next([...this.teacherList]);
})));
}

  fetchAllItem($orgID:any){
      this.teacherList=[];
      return this.http.get<any>(this.commonService.getAPI() + '/getAllItemList/'+ $orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.teacherList=response.data;
      this.studentSubject.next([...this.teacherList]);
    })));
  }

  fetchAllWorkType($orgID:any){
    this.teacherList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/getAllWorkType/'+ $orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
    this.teacherList=response.data;
    this.studentSubject.next([...this.teacherList]);
  })));
  }
  fetchStudentProfile($ledgerID:any){
    this.studentList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/students/studentProfileId/'+ $ledgerID)
   .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Student[]}) => {
     this.studentList=response.data;
     this.studentSubject.next([...this.studentList]);
   })));
}
  fetchAllProfile($ledgerID:any){
  this.studentList=[];
  return this.http.get<any>(this.commonService.getAPI() + '/students/allProfileId/'+ $ledgerID)
 .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Student[]}) => {
   this.studentList=response.data;
   this.studentSubject.next([...this.studentList]);
 })));
}
fetchTeacherProfile($ledgerID:any){
  this.studentList=[];
  return this.http.get<any>(this.commonService.getAPI() + '/students/teacherProfileId/'+ $ledgerID)
 .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Student[]}) => {
   this.studentList=response.data;
   this.studentSubject.next([...this.studentList]);
 })));
}
  fetchAllStates(){
    return this.http.get<any>(this.commonService.getAPI() + '/statesList')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.stateList=response.data;
      this.stateSubject.next([...this.stateList]);
    })));
  }
  fetchAllOrganisaction(){
    this.stateList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/allOrganisation')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.stateList=response.data;
      this.stateSubject.next([...this.stateList]);
    })));
  }
  getStudents(){
    return [...this.studentList];
  }
  getStudentUpdateListener(){
    return this.studentSubject.asObservable();
  }
  updateEmployeeRegistration(studentData:any){
    this.studentList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/updateEmployee', studentData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentList.unshift(response.data);
        this.studentSubject.next([...this.studentList]);
      }
    }))
  }

  saveEmployeeRegistration(studentData:any){
    this.studentList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/saveEmployee', studentData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentList.unshift(response.data);
        this.studentSubject.next([...this.studentList]);
      }
    }))
  }
  saveCustomerRegistration(studentData:any){
    this.studentList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/saveCustomer', studentData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentList.unshift(response.data);
        this.studentSubject.next([...this.studentList]);
      }
    }))
  }
  updateCustomerRegistration(studentData:any){
    this.studentList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/updateCustomer', studentData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentList.unshift(response.data);
        this.studentSubject.next([...this.studentList]);
      }
    }))
  }
  updateItemToService(itemData:any){
    this.studentList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/updateItemToService', itemData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentList.unshift(response.data);
        this.studentSubject.next([...this.studentList]);
      }
    }))
  }
  saveItemToService(itemData:any){
    this.studentList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/saveItemToService', itemData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentList.unshift(response.data);
        this.studentSubject.next([...this.studentList]);
      }
    }))
  }
  updateItem(itemData:any){
    this.studentList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/updateItem', itemData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentList.unshift(response.data);
        this.studentSubject.next([...this.studentList]);
      }
    }))
  }
  saveItem(itemData:any){
    this.studentList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/saveItem', itemData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentList.unshift(response.data);
        this.studentSubject.next([...this.studentList]);
      }
    }))
  }
  saveStudent(studentData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/students', studentData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentList.unshift(response.data);
        this.studentSubject.next([...this.studentList]);
      }
    }))

  }
  saveTeacher(teacherData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/saveTeacher', teacherData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentList.unshift(response.data);
        this.studentSubject.next([...this.studentList]);
      }
    }))

  }
  updateStudent(studentData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/students', studentData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service update:',response);
      if (response.status === true){
        this.studentList.unshift(response.data);
        this.studentSubject.next([...this.studentList]);
      }
    }))
  }

  deleteStudent(id:any){
    console.log("service id:",id);
    //return 0;
     return this.http.delete<any>(this.commonService.getAPI() + '/students/'+ id)
    .pipe(catchError(this.errorService.serverError), tap(response => {
     
     
    }))

  }
}

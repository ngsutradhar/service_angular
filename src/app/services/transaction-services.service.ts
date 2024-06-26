import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Subject } from 'rxjs/internal/Subject';
import { tap } from 'rxjs';
import { StudentToCourse } from '../models/studenttocourse.model';
import { CommonService } from './common.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionServicesService {
  studentToCourseList: StudentToCourse[] =[];
  feesNameList:any[]=[];
  organizationList:any[]=[];
  studentNameList:any[]=[];
  feesReceivedList:any[]=[];
  advReceivedList:any[]=[];
  feesReceivedDetailsList:any[]=[];
  transactionList:any[]=[];
  paymentHistoryDetails:any[]=[];
  //feesReceivedList:any[]=[];
  studentToCourseSubject = new Subject<StudentToCourse[]>();
  feesNameSubject = new Subject<any[]>();
  studentNameSubject = new Subject<any[]>();
  feesReceivedSubject = new Subject<any[]>();
  transactionListSubject = new Subject<any[]>();
  status: string | undefined;
  constructor(private commonService: CommonService, private errorService: ErrorService, private http: HttpClient) {

  }


 fetchPhonepeApi(amount:any,merchantId:any,apiKey:any,merchantUserId:any){
  this.paymentHistoryDetails=[];
  return this.http.get<any>(this.commonService.getAPI() + '/phonepe/'+amount + '/'+ merchantId + '/'+ apiKey + '/'+ merchantUserId)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.paymentHistoryDetails=response.data;
      this.transactionListSubject.next([...this.paymentHistoryDetails]);
    })));
}
  deleteAdvAdjustmentFeesReceived($id:any){
    this.advReceivedList=[];
    return this.http.delete<any>(this.commonService.getAPI() + '/transactions/deleteAdvAdjustmentReceived/'+$id)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.advReceivedList=response.data;
      this.transactionListSubject.next([...this.advReceivedList]);
    })));
  }

  fetchAllAdvFeesReceivedAdjustment($orgID:any){
    this.advReceivedList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/getAdvancedReceivedAdjustmentMaster/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.advReceivedList=response.data;
      this.feesReceivedSubject.next([...this.advReceivedList]);
    })));
  }
  updateAdvancedFeesReceived(id:any,updateFeeReceivedData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/transactions/updateFeesReceived/' +id, updateFeeReceivedData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }

  fetchOrganizationDetails($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/getOrganisationById/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.organizationList=response.data;
      //this.feesNameSubject.next([...this.feesNameList]);
    })));
  }
  fetchEditAdvancedReceived($registerID:any){
    this.advReceivedList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/getEditAdvReceived/'+$registerID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.advReceivedList=response.data;
      //this.feesNameSubject.next([...this.feesNameList]);
    })));
  }
  fetchAdvancedDetails($registerID:any){
    this.advReceivedList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/getAdvancedInfo/'+$registerID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.advReceivedList=response.data;
      //this.feesNameSubject.next([...this.feesNameList]);
    })));
  }
  fetchAllAdvancedReceivedDetails($orgID:any){
    this.advReceivedList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/getAllAdvancedDetails/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.advReceivedList=response.data;
      //this.feesNameSubject.next([...this.feesNameList]);
    })));
  }
  fetchAllAdvancedReceivedHistory($orgID:any){
    this.advReceivedList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/getAllAdvancedReceivedHistory/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.advReceivedList=response.data;
      //this.feesNameSubject.next([...this.feesNameList]);
    })));
  }
  fetchAllAdvancedReceivedLedgerId($id:any){
    this.advReceivedList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/getAllAdvancedReceivedByLedgerId/'+$id)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.advReceivedList=response.data;
      //this.feesNameSubject.next([...this.feesNameList]);
    })));
  }
  fetchAllAdvancedReceivedHistoryById($id:any){
    this.advReceivedList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/getAllAdvancedReceivedHistoryById/'+$id)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.advReceivedList=response.data;
      //this.feesNameSubject.next([...this.feesNameList]);
    })));
  }
  fetchFeeReceivedDetailsList(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getFeesReceived',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedDetailsList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedDetailsList]);
    })));
  }
  fetchAllReceipt(data: any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getAllReceiptId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedList]);
    })));
  }
  fetchSingleReceipt(data: any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getReceiptId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedList]);
    })));
  }
  fetchAllStudentToCourses(data: any){
    return this.http.post<any>(this.commonService.getAPI() + '/getRegisterCourseByStudentId', data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      console.log("Student to courseList:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }

  fetchAllFeesName(){
    return this.http.get<any>(this.commonService.getAPI() + '/feesName')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesNameList=response.data;
      this.feesNameSubject.next([...this.feesNameList]);
    })));
  }
  fetchDiscountFeesName(){
    return this.http.get<any>(this.commonService.getAPI() + '/students/feesNameDiscount')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      // this.feesNameList=response.data;
      // this.feesNameSubject.next([...this.feesNameList]);
    })));
  }
  fetchAllStudentName($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/registerStudent/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      // this.studentNameList=response.data;
      // this.studentNameSubject.next([...this.studentNameList]);
    })));
  }
  fetchAllAdvStudentName($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/advRegisterStudent/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
       this.studentNameList=response.data;
       this.studentNameSubject.next([...this.studentNameList]);
    })));
  }
  fetchAllCourseName(){
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/feesName')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesNameList=response.data;
      this.feesNameSubject.next([...this.feesNameList]);
    })));
  }

  fetchAllFeesCharged($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/allFeesCharged/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedList]);
    })));
  }
  fetchAllFeesDiscount($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/allFeesDiscount/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedList]);
    })));
  }
  fetchAllFeesReceived($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/allFeesReceived/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedList]);
    })));
  }
  fetchAllTransaction(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getFeeCharge',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.transactionList=response.data;
      this.transactionListSubject.next([...this.transactionList]);
    })));
  }

  fetchReceivedEdit(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getFeesReceivedEdit',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.transactionList=response.data;
      this.transactionListSubject.next([...this.transactionList]);
    })));
  }

  fetchAllActiveCourse(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/getRegisterCourseByStudentId', data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      console.log("Student to courseList:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }
  fetchCourseId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/getCourseId', data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      console.log("Student to courseList:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));

   }
  feesCharge(feeChargeData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesCharged', feeChargeData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }

  feesDiscountCharge(feeChargeData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesDiscountCharged', feeChargeData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }
  saveFeesReceiveOnline(merchantTransactionId:any,feeReceivedData:any){
     this.http.delete(this.commonService.getAPI() + '/feesReceivedOnline/'+ merchantTransactionId)
            .subscribe(() => this.status = 'Delete successful');

    return this.http.post<any>(this.commonService.getAPI() + '/feesReceivedOnline/' + merchantTransactionId, feeReceivedData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }
  saveFeesReceive(feeReceivedData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesReceived', feeReceivedData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }

  updateFeesCharge(id:any,updateFeeChargedData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/transactions/updateFeesCharged/' +id, updateFeeChargedData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }
  updateFeesReceived(id:any,updateFeeReceivedData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/transactions/updateFeesReceived/' +id, updateFeeReceivedData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }
  fetchFeesChargeDetailsById(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesChargedDetailsMain',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      console.log("Fees Course Details:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }

  //----------------- Fees Received Function start -----------------------
  fetchFeesDueListId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesDueListByTranId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      //console.log("Fees Due List:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }
 
  fetchFeesDueListEditId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesDueListEditByTranId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      //console.log("Fees Due List:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }

  fetchAllTranMasterId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getTranMasterId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      //console.log("Fees Due List:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }
  fetchAllUpdateTranMasterId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getUpdateTranMasterId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      //console.log("Fees Due List:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }
  fetchDiscountByTranId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/allTotalDiscountByTranId',data)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }

  fetchFeesDueLedgerId(data:any){
     return this.http.post<any>(this.commonService.getAPI() + '/transactions/getFeesByLedgerId', data)
     .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      console.log("Due list By Ledger:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }

  
  
  fetchMonthlyStudentList($orgID:any){
    this.studentToCourseList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/getMonthlyStudent/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }

  monthlyFeesCharge(feeChargeData:any){
    this.studentToCourseList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/monthlyFeesCharged', feeChargeData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }

  allStudentMonthlyFeesCharge($orgID:any){
    this.studentToCourseList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/monthlyAllFeesCharged/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      this.studentToCourseList=response.data;
      console.log("allStudentMonthlyFeesCharge:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    }))
  }

  saveAadvancedFeesReceived(advfeeReceivedData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesReceivedAdvanced', advfeeReceivedData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.success === 1){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }
  saveAadvancedFeesReceivedAdjustment(advfeeReceivedAdjData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesReceivedAdvancedAdjustment', advfeeReceivedAdjData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.success === 1){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }
 
}

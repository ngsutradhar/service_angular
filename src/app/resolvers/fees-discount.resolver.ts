import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { forkJoin, map, Observable, of } from 'rxjs';
import {TransactionServicesService} from "../services/transaction-services.service";
@Injectable({
  providedIn: 'root'
})
export class FeesDiscountResolver implements Resolve<boolean> {
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
    const join= forkJoin(b,c).pipe(map((allResponses: any[]) => {
      return {
        studentsChargeDiscount1: allResponses[0],
        feesNames: allResponses[1]
      };
    }));
    return join;
  }
}

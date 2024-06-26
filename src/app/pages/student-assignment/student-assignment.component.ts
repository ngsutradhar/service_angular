import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-assignment',
  templateUrl: './student-assignment.component.html',
  styleUrls: ['./student-assignment.component.scss']
})
export class StudentAssignmentComponent implements OnInit {
  tempNewsObj:object={};
  tempChargeObj:object={};
  tempReceicedObj:object={};
  studentAssignmentArray:any[]=[];
  tempFeesReceivedArray:any[]=[];
  organisationId:number=0;
  UserID:number=0;
  payAmountNgModel: number = 0;
  paymentAmount:number=0;
  merchantId:any;
  apiKey:any;
  merchantUserId:any;
  transactionMonth:any;
  transactionYear:any;
  ledgerId:number=0;
  defaultPicture: string = "";
  studentCourseHistoryArray:any[]=[];
  FinalPayFormGroup: any;
  datePipe: any;
  autoGenerateId:number=0;
  isShowBtn:boolean=false;
  constructor(private commonService: CommonService
    ,private reportService: ReportService
    ,private route: ActivatedRoute
    ,private transactionServicesService: TransactionServicesService
    , public authService: AuthService) { 

      const user = localStorage.getItem('user');
      if (user){
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        this.ledgerId = JSON.parse(<string>user).ledgerId;
        console.log("user localUserID:",(this.UserID));
        console.log("user organisationId:",(this.organisationId));
        console.log("Ledger id:",(this.ledgerId));
      }
      this.getStudentToCourseRegistrationListLedgerId(this.ledgerId);
      this.randomNum(4999,99999999999);
  }

  ngOnInit(): void {
    this.defaultPicture = this.commonService.getPublic() + '/assignment_upload/';
    this.FinalPayFormGroup = new FormGroup({
      payAmount: new FormControl(null, [Validators.required]),
    })
  }
  getStudentToCourseRegistrationListLedgerId($ledgerID:any){
    this.reportService.fetchStudentToCourseRegistrationReportLedgerId($ledgerID).subscribe(response => {
      this.studentCourseHistoryArray=response.data;
      console.log("studentCourseHistoryArray:",this.studentCourseHistoryArray);
      this.tempNewsObj = {
        courseId: this.studentCourseHistoryArray[0].course_id,
        organisationId: this.organisationId
      }; 
      console.log("course ID:",this.tempNewsObj);
      this.getStudentSyllabusList();
      
    })
  }
  getStudentSyllabusList(){
    this.reportService.fetchStudentAssignmentListReport(this.tempNewsObj).subscribe(response => {
      this.studentAssignmentArray=response.data;
      console.log("studentAssignmentArray:",this.studentAssignmentArray);
    })
  }
  saveOnlinePayment(){
    var date = new Date();
    const cValue = formatDate(date, 'yyyy-MM-dd', 'en-US');
    const DateObj = new Date();
    
    this.transactionMonth = DateObj.getMonth() + 1;
    this.transactionYear = DateObj.getFullYear();
    console.log("Month No:", DateObj.getMonth() + 1);
    console.log("Year No:", DateObj.getFullYear());



     this.tempChargeObj = {
      ledgerId: this.ledgerId,
      transactionTypeId: 2,
      amount: this.paymentAmount
    }
    this.tempReceicedObj = {
      ledgerId: this.ledgerId,
      transactionTypeId: 1,
      amount: this.paymentAmount
    }
    this.tempFeesReceivedArray.push(this.tempReceicedObj);


    this.tempFeesReceivedArray.push(this.tempChargeObj);
     this.tempNewsObj = {
      transactionMaster: {
        userId: this.UserID,
        referenceTransactionMasterId: 262,
        transactionDate: cValue,
        comment:"Online Payment",
        feesYear: this.transactionYear,
        feesMonth: this.transactionMonth,
        organisationId: this.organisationId
      },
      transactionDetails: Object.values(this.tempFeesReceivedArray)
    };  
   Swal.fire({
      text: '',
      title: 'Are you sure ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.transactionServicesService.saveFeesReceiveOnline(this.autoGenerateId,this.tempNewsObj).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Fees has been Received..',
              showConfirmButton: false,
              timer: 1500
            });
           }
           else if(response.success === 0) {
            Swal.fire({
              position: 'top-end',
              icon: "error",
              title: 'Sorry Your Payment Not Updated.',
              showConfirmButton: false,
              timer: 1500
            });
           }
          }, (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error,
              footer: '<a href>Why do I have this issue?</a>',
              timer: 0
            });
          });
        
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })      
  }
  onlinePayment(){
    this.isShowBtn=true;
    this.studentAssignmentArray=[];
    this.paymentAmount = this.payAmountNgModel;
    this.apiKey="099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    this.merchantId="PGTESTPAYUAT";
    this.merchantUserId="MUID123";
    console.log("amount:",this.paymentAmount);
    
    /* this.transactionServicesService.fetchPhonepeApi(this.paymentAmount,this.merchantId,this.apiKey,this.merchantUserId).subscribe(response => {
      this.studentAssignmentArray=response.data;
      console.log("Payment Success data:",this.studentAssignmentArray);
    }) */
    let testUrl=this.commonService.getAPI() + '/phonepe/'+this.paymentAmount + '/'+ this.merchantId + '/'+ this.apiKey + '/'+ this.merchantUserId + '/'+ this.autoGenerateId;
    //window.location.href=testUrl;

    //var url = '@Url.Action("PrintIndex", "Callers", new {dateRequested = "findme"})';
   window.open(testUrl, '_blank');
   
   /*  let testUrl=this.commonService.getAPI() + '/phonepe/'+this.paymentAmount + '/'+ this.merchantId + '/'+ this.apiKey + '/'+ this.merchantUserId;
    window.location.href=testUrl; */
    
   
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  clear(table: Table) {
    table.clear();
  } 
  randomNum(min:number, max:number) {
    this.autoGenerateId=Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

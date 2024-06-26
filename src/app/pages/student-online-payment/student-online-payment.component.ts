import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { ReportService } from 'src/app/services/report.service';
import { StudentToCourseService } from 'src/app/services/student-to-course.service';
import { StudentService } from 'src/app/services/student.service';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
import Swal from 'sweetalert2';
import { ToWords } from 'to-words';
const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: { // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    }
  }
});
@Component({
  selector: 'app-student-online-payment',
  templateUrl: './student-online-payment.component.html',
  styleUrls: ['./student-online-payment.component.scss']
})
export class StudentOnlinePaymentComponent implements OnInit {
  selectedIndex=0;
  fullCourseName:string='';
  feesName:string='';
  paymentAmount:number=0;

  transactionId:number=0;
  transactionDate:string='';

  tempPhonepeObj!: object;
  tempGetActiveCourseObj!: object;

  tempItemObj!: object;
  tempSaveItemObj!: object;
  tempObj!: object;
  tempChargeObj!: object;
  tempReceicedObj!: object;
  tempReceicedObj_1!: object;
  tempCashChargeObj!: object;

  AllInactiveStudentArray:any[]=[];
  organisationId:number=0;
  PhonepePaymentHistoryarray:any[]=[];
  AllOrgDetailsArray:any[]=[];
  AllOrgFeesChargedArray:any[]=[];
  AllOrgFeesReceivedArray:any[]=[];
  studentProfileDetalilsArray:any[]=[];
  studentCourseHistoryArray:any=[];
  UserID:number=0;
  organisationName:string='';
  studentQualification:string='';
  studentAddress:string='';
  studentPin:string='';
  studentContact:string='';
  studentEmail:string='';
  ledgerId:number=0;
  organizationArray: any = [];
  studentNewsArray:any[]=[];
  allBillReceiptArray: any = [];
  tranMasterIdArray:any=[]
  marchantIdArray: any = [];
  organisationAddress:string='';
  organisationPin:string='';
  organisationContact:string='';
  organisationEmail:string='';


  FinalPayFormGroup: FormGroup | any;
  tempFeesReceivedArray:any[]=[];
  showReceipt:boolean=false;
  rupeeInWords:string='';
  totalRecepitAmount:number=0;
  totalDueAmount:number=0;

  merchantId:any;
  apiKey:any;
  merchantUserId:any;
  transactionMonth:any;
  transactionYear:any;
  autoGenerateId:number=0;

  whatsapp_number: string = '';
  billing_name: string = '';
  full_name: any;
  ledger_name: any;
  total_course_fees: any;
  transaction_date: any;
  transaction_number: any;
  total_discount: any;
  temp_total_received: any;
  comment: any;
  defaultPicture: string = "";
  payAmountNgModel: number = 0;
  isShowBtn:boolean=false;
  tempNewsObj:object={};
  counter:number=36;
  interval:any;
  constructor(private studentToCourseService: StudentToCourseService,
    private commonService: CommonService
    ,private reportService: ReportService
    ,private organisationService: OrganisationService
    ,private route: ActivatedRoute
    , public authService: AuthService
    , private activatedRoute: ActivatedRoute
    , private studentService: StudentService
    ,private transactionServicesService: TransactionServicesService) {
    const user = localStorage.getItem('user');
    if (user){
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      this.ledgerId = JSON.parse(<string>user).ledgerId;
      console.log("user localUserID:",(this.UserID));
      console.log("user organisationId:",(this.organisationId));
      console.log("Ledger id:",(this.ledgerId));
    }
    this.getStudentProfile(this.ledgerId);
    this.getStudentToCourseRegistrationListLedgerId(this.ledgerId);
    this.randomNum(4999,999999999999);
    //this.getStudentNewsList(this.organisationId);
   }

  ngOnInit(): void {
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
      for (let val of this.studentCourseHistoryArray) {
        this.totalDueAmount = Number(this.totalDueAmount) + Number(val.total_due);
        //console.log("total Due:",val.total_due);
      }
      console.log("total Due:",this.totalDueAmount);
    })
    
    
  }
  getStudentProfile($ledgerID: any) {
    this.studentService.fetchEmployeeProfile($ledgerID).subscribe(response => {
     this.studentProfileDetalilsArray = response.data;
     this.organisationName=this.studentProfileDetalilsArray[0].organisation_name;
     this.studentAddress=this.studentProfileDetalilsArray[0].address;
     this.studentPin=this.studentProfileDetalilsArray[0].pin;
     this.studentContact=this.studentProfileDetalilsArray[0].whatsapp_number;
     this.studentEmail=this.studentProfileDetalilsArray[0].email_id;
     this.studentQualification=this.studentProfileDetalilsArray[0].qualification;
     this.organisationAddress=this.studentProfileDetalilsArray[0].organisationAddress;
     this.organisationPin=this.studentProfileDetalilsArray[0].organisationPin;
     this.organisationContact=this.studentProfileDetalilsArray[0].organisationContact;
     this.organisationEmail=this.studentProfileDetalilsArray[0].organisationEmail;
     this.apiKey=this.studentProfileDetalilsArray[0].apiKey;
     this.merchantId=this.studentProfileDetalilsArray[0].merchantId;
     this.merchantUserId=this.studentProfileDetalilsArray[0].merchantUserId;
     console.log("studentProfileDetalilsArray :", this.studentProfileDetalilsArray);
   }) 
 }
  onClickedPaymentVoucher(stuToCourseId: any){

    this.totalRecepitAmount = 0;
    this.rupeeInWords = '';
    this.showReceipt = true;
    this.selectedIndex = 1;
    
       this.tempGetActiveCourseObj={};
       this.tempGetActiveCourseObj={
           id: stuToCourseId,
           organisationId:this.organisationId
       };
    console.log("id:", stuToCourseId);
    this.transactionServicesService.fetchAllReceipt(this.tempGetActiveCourseObj).subscribe(response => {
      this.allBillReceiptArray = response.data;
      console.log("Array:", this.allBillReceiptArray);
      this.billing_name = this.allBillReceiptArray[0].billing_name;
      this.whatsapp_number = this.allBillReceiptArray[0].whatsapp_number;
      this.full_name = this.allBillReceiptArray[0].full_name;
      this.total_course_fees = this.allBillReceiptArray[0].total_course_fees;
      this.transaction_date = this.allBillReceiptArray[0].transaction_date;
      this.transaction_number = this.allBillReceiptArray[0].transaction_number;
      this.total_discount = this.allBillReceiptArray[0].total_discount;
      for (let val of this.allBillReceiptArray) {
        this.totalRecepitAmount = Number(this.totalRecepitAmount) + Number(val.temp_total_received);
      }
      this.rupeeInWords = toWords.convert(this.totalRecepitAmount);
    })
  }
  onClickedClosed() {
    this.selectedIndex = 0;
    clearInterval(this.interval);
  }
  saveOnlinePayment(){
    /*  this.http.delete('https://jsonplaceholder.typicode.com/posts/1')
             .subscribe(() => this.status = 'Delete successful');` */
             
     this.tempNewsObj={};
     this.tempChargeObj={};
     this.tempReceicedObj={};
 
     this.paymentAmount = this.payAmountNgModel;
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
       ledgerId: 2,
       transactionTypeId: 1,
       amount: this.paymentAmount
     }
     this.tempFeesReceivedArray.push(this.tempReceicedObj);
 
 
     this.tempFeesReceivedArray.push(this.tempChargeObj);
      this.tempNewsObj = {
       transactionMaster: {
         userId: this.UserID,
         referenceTransactionMasterId: this.transactionId,
         transactionDate: cValue,
         comment:this.feesName,
         feesYear: this.transactionYear,
         feesMonth: this.transactionMonth,
         organisationId: this.organisationId
       },
       transactionDetails: Object.values(this.tempFeesReceivedArray)
     };  
     this.transactionServicesService.saveFeesReceiveOnline(this.autoGenerateId,this.tempNewsObj).subscribe(response => {
       if (response.success === 1) {
          Swal.fire({
           position: 'top-end',
           icon: 'success',
           title: 'Fees has been Received..',
           showConfirmButton: false,
           timer: 1500
         });
         window.location.reload();
        }
       })
   
   }
  btnPayNow(data:any){
    this.selectedIndex = 2;
    console.log("data:",data)
    this.fullCourseName=data.full_name;
    this.tempGetActiveCourseObj = {
      id: data.id,
      organisationId: this.organisationId
    };
    this.transactionServicesService.fetchAllTranMasterId(this.tempGetActiveCourseObj).subscribe(response => {
      this.tranMasterIdArray = response.data;
      console.log("tranMasterIdArray:",this.tranMasterIdArray);

    })
  }
  onPayment(data:any) {
    this.selectedIndex = 3;
    console.log("Final Payment data:",data);
    this.transactionId=data.id;
    this.transactionDate=data.transaction_date;
    this.feesName=data.ledger_name;
    this.paymentAmount=data.total_due;
    this.payAmountNgModel=data.total_due;

  }
  getCheckMarchantId(autoGenerateId:any){
   
    this.counter--;
    if(this.counter==0){
      if (this.interval) {
        clearInterval(this.interval);
        Swal.fire({
          position: 'top-end',
          icon: "error",
          title: 'Sorry Your Time Is Over! Try Again',
          showConfirmButton: false,
          timer: 3000
        });
        window.location.reload();
     }
    }
    
     this.reportService.fetchCheckMerchantTransactionId(autoGenerateId).subscribe(response => {
      console.log("success marchantId:",response.success);
      if (response.success === 1) {
          this.saveOnlinePayment();
      }
    }) 
     
  }
  onFinalPayNow(){
    this.interval=setInterval(()=> this.getCheckMarchantId(this.autoGenerateId), 5000);
    this.paymentAmount = this.payAmountNgModel;
    console.log("amount:",this.paymentAmount);
    
    this.isShowBtn=true;
    this.paymentAmount = this.payAmountNgModel;
    this.apiKey="099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    this.merchantId="PGTESTPAYUAT";
    this.merchantUserId="MUID123";
    console.log("amount:",this.paymentAmount);
    
    let testUrl=this.commonService.getAPI() + '/phonepe/'+this.paymentAmount + '/'+ this.merchantId + '/'+ this.apiKey + '/'+ this.merchantUserId + '/'+ this.autoGenerateId;
    
    window.open(testUrl, '_blank'); 
   
     
  }
  clear(table: Table) {
    table.clear();
  } 
  getEventValue($event:any) :string {
    return $event.target.value;
  }
  onTabChanged(event:any){
    console.log(event)
  }
  randomNum(min:number, max:number) {
    this.autoGenerateId=Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

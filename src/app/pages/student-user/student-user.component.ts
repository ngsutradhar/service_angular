import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-student-user',
  templateUrl: './student-user.component.html',
  styleUrls: ['./student-user.component.scss']
})
export class StudentUserComponent implements OnInit {

  buttonColor = "black";
  buttonType = "buy";
  isCustomSize = false;
  buttonWidth = 240;
  buttonHeight = 40;
  isTop = window === window.top;

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
  employeeId:number=0;
  organizationArray: any = [];
  studentNewsArray:any[]=[];
  allBillReceiptArray: any = [];
  tranMasterIdArray:any=[]
  orderPendingArray:any[]=[];
  orderCompletedArray:any[]=[];
  marchantIdArray: any = [];
  organisationAddress:string='';
  organisationPin:string='';
  organisationContact:string='';
  organisationEmail:string='';


  FinalPayFormGroup: FormGroup | any;
  tempFeesReceivedArray:any[]=[];
  showReceipt:boolean=false;
  selectedIndex: number = 0;
  rupeeInWords:string='';
  totalRecepitAmount:number=0;
  totalDueAmount:number=0;

  merchantId:any;
  apiKey:any;
  merchantUserId:any;
  transactionMonth:any;
  transactionYear:any;
  autoGenerateId:number=0;

  employeeName:string='';
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
      this.employeeId = JSON.parse(<string>user).employeeId;
      console.log("user localUserID:",(this.UserID));
      console.log("user organisationId:",(this.organisationId));
      console.log("employeeId id:",(this.employeeId));
    }
    this.getEmployeeProfile(this.employeeId);
    this.getOrderPendingList(this.organisationId,this.employeeId);
    //this.getStudentToCourseRegistrationListLedgerId(this.ledgerId);
    //this.randomNum(4999,999999999999);
    //this.getStudentNewsList(this.organisationId);
   }
  
  ngOnInit(): void {
    //var x=setInterval(this.test, 5000);
    this.defaultPicture = this.commonService.getPublic() + '/file_upload/';
    this.FinalPayFormGroup = new FormGroup({
      payAmount: new FormControl(null, [Validators.required]),
    })
  }
  onTabChanged(event:any){
    console.log(event)
  }
  onLoadPaymentData(event:any) {
    console.log("load payment data", event.detail);
  }//hjrghfsghsdg
  getEmployeeProfile($ledgerID: any) {
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
       console.log("studentProfileDetalilsArray :", this.studentProfileDetalilsArray);
    }) 
    //window.location.reload();
  }
  clear(table: Table) {
    table.clear();
  } 
  
  getEventValue($event:any) :string {
    return $event.target.value;
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
      this.getStudentNewsList();
      for (let val of this.studentCourseHistoryArray) {
        this.totalDueAmount = Number(this.totalDueAmount) + Number(val.total_due);
        //console.log("total Due:",val.total_due);
      }
      console.log("total Due:",this.totalDueAmount);
    })
    
    
  }
  btnPayNow(data:any){
    this.selectedIndex = 4;
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
  getStudentNewsList(){
    this.reportService.fetchStudentNewsListReport(this.tempNewsObj).subscribe(response => {
      this.studentNewsArray=response.data;
      console.log("studentNewsArray:",this.studentNewsArray);
    })
  }
  getOrderCompletedList($orgID:any){
    this.studentService.fetchOrderCompletedDetails($orgID).subscribe(response => {
      this.orderCompletedArray=response.data;
      //this.employeeName=this.orderPendingArray[0].employee_name;
      console.log("orderCompletedArray:",this.orderCompletedArray);
    })
  }
  getOrderPendingList($orgID:any,$id:any){
    this.studentService.fetchOrderPendingDetails($orgID,$id).subscribe(response => {
      this.orderPendingArray=response.data;
      this.employeeName=this.orderPendingArray[0].employee_name;
      console.log("orderPendingArray:",this.orderPendingArray);
    })
  }
  /* onPayment(data:any){
    console.log(data);
  } */
  onlineExam(){
    /* window.location.href='https://easytestmaker.com/'; */
    window.open('https://easytestmaker.com/', '_blank', 'noopener, noreferrer');
  }
 
 
 
 
  onClickedCompletedOrder(data: any){
   console.log("order details:",data.order_details_id);
   /* this.studentService.updateOrderCompleted(data.order_details_id).subscribe(response => {
      this.orderCompletedArray=response.data;
      console.log("orderCompletedArray:",this.orderCompletedArray);
    }) */
    Swal.fire({
      title: 'Are you sure?',
      text: 'Completed This Job...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
       
        this.studentService.updateOrderCompleted(data.order_details_id).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Job has been Competed',
              showConfirmButton: false,
              timer: 1500
            });
           this.getOrderPendingList(this.organisationId,this.employeeId);
          }

        }, (error) => {
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
   /*  this.totalRecepitAmount = 0;
    this.rupeeInWords = '';
    this.showReceipt = true;
    this.selectedIndex = 2;
    
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
    }) */
  }
  onClickedClosed() {
    this.selectedIndex = 1;
  }
  onActivePayment(){
    this.selectedIndex = 1;
  }
  onActiveGallery(){
    this.selectedIndex = 3;
  }
  onActiveAcademic(){
    this.selectedIndex = 0;
  }
  randomNum(min:number, max:number) {
    this.autoGenerateId=Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
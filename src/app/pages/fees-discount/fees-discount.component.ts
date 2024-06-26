import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { CommonService } from 'src/app/services/common.service';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Table } from 'primeng/table/table';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-fees-discount',
  templateUrl: './fees-discount.component.html',
  styleUrls: ['./fees-discount.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class FeesDiscountComponent implements OnInit {
  UserID:number=0;
  organisationId:number=0;
  isDeviceXS = false;
  checked = false;
  isSave = false;
  totalCurrentDue:number=0;
  courseNameBoolean:boolean=false;
  transactionNoBoolean:boolean=false;
  feeAmountBoolean:boolean=false;
  saveButtonBoolean:boolean=false;;
  studentId: any;
  discountAmount:any;
  transactionDate: any;
  transactionMonth:any;
  transactionYear:any;
  totalFees: number = 0;
  totalCourseDue:number=0;
  totalBilledAmount: number = 0;
  totalReceivedAmount: number = 0;
  receivedGrandTotal:number=0;
  totalDiscount:number=0;
  netDueAmount:number=0;
  totalDuedAmount: number = 0;
  studentName: any;
  courseName: any;
  comment: any;
  transactionId: any;
  showTableRow: boolean = false;
  disabled = false;
  hiddenPopup: boolean = false;
  hiddenInput: boolean = false;
  showBox: boolean = true;
  isShown: boolean = false; // hidden by default
  isPopupButton: boolean = false;
  hiddenPopupDiscount:boolean=false;
  isCashReceived: boolean = false;
  referenceTransactionMasterId: number = 0;
  //studentsChargeDiscount: any[] = [];
  feesReceivedDetailsArray:any[]=[];
  feesDueListArray: any[] = [];
  studentToCourseId: any;
  studentNameList: any[] = [];
  FeesDiscountFormGroup: FormGroup | any;
  BankReceivedFormGroup: FormGroup | any;
  feesNameList: any[] = [];
  CourseId: any;
  courseNameList: any = [];
  transactionList: any = [];
  tempFeesArray: any = [];
  feesDiscountArray: any = [];
  tranMasterIdArray: any[] = [];
  discountTranIDArray: any[] = [];
  feesChargeDetailsArray: any = [];
  tempFeesReceivedArray: any = [];
  tempItemObj!: object;
  tempGetActiveCourseObj!: object;
  tempSaveItemObj!: object;
  tempObj!: object;
  tempChargeObj!: object;
  tempReceicedObj!: object;
  tempCashChargeObj!: object;
  courses: any[] = [];
  popUpRestultArray: any[] = [];
  getCourseIdArray: any[] = [];
  ledgerId: number = 0;
  amount: number = 0;
  event: number = 0;
  tempTotalAmount: number = 0;
  totalAmount: number = 0;
  removeTotalAmount: number = 0;
  showErrorMessage: boolean | undefined;
  errorMessage: any;
  msgs: { severity: string; summary: string; detail: string; }[] | undefined;
  animal: any;
  datepipe!: DatePipe;

  constructor(private transactionServicesService: TransactionServicesService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    public commonService: CommonService,
    public dialog: MatDialog) {
    this.activatedRoute.data.subscribe((response: any) => {
     /*  this.studentNameList = response.feesChargeResolver.studentsChargeDiscount.data;
      this.feesNameList = response.feesChargeResolver.feesNames.data; */
      /* this.studentNameList=response.FeesDiscountResolver.studentsChargeDiscount1.data 
      this.feesNameList = response.FeesDiscountResolver.feesNames.data;*/

    });
    this.isDeviceXS = commonService.getDeviceXs();
    const user = localStorage.getItem('user');
    if (user){
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:",(this.UserID));
      console.log("user organisationId:",(this.organisationId));
    }
  }

  ngOnInit(): void {
    //this.studentsChargeDiscount = [];
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');

    this.FeesDiscountFormGroup = new FormGroup({
      pay_discount: new FormControl(0, [Validators.required]),
      studentId: new FormControl(1, [Validators.required]),
      transactionId: new FormControl(0, [Validators.required]),
      transactionMasterId: new FormControl(1, [Validators.required]),
      comment: new FormControl(),
      amount: new FormControl(null, [Validators.required]),
      transactionDate: new FormControl(val),
      studentToCourseId: new FormControl(1, [Validators.required]),
      ledgerId: new FormControl(22, [Validators.required]),
    })

    this.BankReceivedFormGroup = new FormGroup({
      accountNo: new FormControl(null, [Validators.required]),
      ifscNo: new FormControl(null, [Validators.required]),
      branch: new FormControl(null, [Validators.required])
    })

    this.transactionServicesService.fetchDiscountFeesName().subscribe(response => {
      this.feesNameList = response.data;
    })
    this.transactionServicesService.fetchAllStudentName(this.organisationId).subscribe(response => {
      this.studentNameList = response.data;
    })

    this.getAllDiscountFees(this.organisationId);



  }
  discountAmountNgModel=0;
  selectedIndex = 0;
  onTabChanged(event: any) {
    this.event = event;
    console.log(this.event);
    //if(event===1)
  }
  onClickedOutside(e: Event) {
    if (this.showBox === false) {
      this.showBox = !this.showBox;
    }
    else {
      this.showBox = false;
    }
  }
  onClickedRowShow(data: any) {
    this.totalFees = 0;
    this.studentName = data.studentName;
    this.courseName = data.courseName;
    this.transactionServicesService.fetchFeesChargeDetailsById(data.studentCourseRegistrationId).subscribe(response => {
      this.feesChargeDetailsArray = response.data;
      for (let val of this.feesChargeDetailsArray) {
        this.totalFees += val.amount;
      }
    })
    if (this.showTableRow === false) {
      this.showTableRow = !this.showTableRow;
    }
    else {
      this.showTableRow = false;
    }
  }
  getAllDiscountFees($orgID:any) {
    this.transactionServicesService.fetchAllFeesDiscount($orgID).subscribe(response => {
      this.feesDiscountArray = response.data;
      console.log(this.feesDiscountArray);
    })
  }
  getTranMasterId() {
    this.hiddenPopup=true;
    this.receivedGrandTotal=0;
    this.totalCourseDue=0;
    this.totalCurrentDue=0;
    this.tempGetActiveCourseObj={};
    this.feesReceivedDetailsArray = [];
    this.tranMasterIdArray = [];
    this.transactionNoBoolean=true;
    this.feeAmountBoolean=false;
    this.FeesDiscountFormGroup.patchValue({transactionMasterId:''});
    this.FeesDiscountFormGroup.patchValue({amount:''});
    let studentToCourseId = this.FeesDiscountFormGroup.get('studentToCourseId')?.value;
    console.log("studentToCourseId:", studentToCourseId);
    
    this.tempGetActiveCourseObj={
        id: studentToCourseId,
        organisationId:this.organisationId
    };
    this.tranMasterIdArray = [];
    this.transactionServicesService.fetchAllTranMasterId(this.tempGetActiveCourseObj).subscribe(response => {
      this.tranMasterIdArray = response.data;
      console.log(this.tranMasterIdArray);
    })
    console.log("studentToCourseId-2:", studentToCourseId);
    
    this.transactionServicesService.fetchFeeReceivedDetailsList(this.tempGetActiveCourseObj).subscribe(response => {
      this.feesReceivedDetailsArray = response.data;
      console.log("feesReceivedDetailsArray:",this.feesReceivedDetailsArray);
      if(this.feesReceivedDetailsArray[0].totalDue>0){
        this.totalCourseDue=this.feesReceivedDetailsArray[0].totalDue;
        for (let val of this.feesReceivedDetailsArray) {
            this.receivedGrandTotal = this.receivedGrandTotal + val.temp_total_received;
        }
        this.totalCurrentDue=this.totalCourseDue-this.receivedGrandTotal;
      }else{
        this.totalCourseDue=0;
      }
      
      
    })
    
  }
  getAllTranMasterId($id: any) {
    let studentToCourseId = this.FeesDiscountFormGroup.get('studentToCourseId')?.value;
    this.courseNameList = [];

    this.tempGetActiveCourseObj={};
    this.tempGetActiveCourseObj={
      id: $id,
      organisationId:this.organisationId
  };
    this.transactionServicesService.fetchAllTranMasterId(this.tempGetActiveCourseObj).subscribe(response => {
      this.tranMasterIdArray = response.data;
      console.log(this.tranMasterIdArray);
    })
  }

  onAddFees() {
    this.studentId = this.FeesDiscountFormGroup.get('studentId')?.value;
    //this.transactionDate =this.FeesDiscountFormGroup.get('transactionDate')?.value;
  /*   let tr_date = this.FeesDiscountFormGroup.get('transactionDate')?.value;
    this.transactionDate = formatDate(tr_date, 'yyyy-MM-dd', 'en'); */
    this.studentToCourseId = this.FeesDiscountFormGroup.get('studentToCourseId')?.value;
    /* this.comment = this.FeesDiscountFormGroup.get('comment')?.value; */
   /*  let feesYear = new Date().getFullYear();
    let feesMonth = new Date().getMonth().toString(); */
    console.log("studentId:", this.studentId);
    /* console.log("transactionDate:", this.transactionDate); */
    this.ledgerId = this.FeesDiscountFormGroup.get('ledgerId')?.value;
    this.amount = this.FeesDiscountFormGroup.get('amount')?.value;
    this.totalAmount = Number(this.totalAmount) + Number(this.amount);
    const tempItem = this.FeesDiscountFormGroup.value;
    let index = this.feesNameList.findIndex((x: { id: any; }) => x.id === tempItem.ledgerId);
    this.tempItemObj = {
      ledgerId: this.ledgerId,
      transactionTypeId: 1,
      feesName: this.feesNameList[index].ledger_name,
      amount: this.amount
    }
    this.tempFeesArray.push(this.tempItemObj);
    this.tempTotalAmount = this.totalAmount;
    this.isSave = true;
    this.FeesDiscountFormGroup = new FormGroup({
      amount: new FormControl(null, [Validators.required]),
      ledgerId: new FormControl(null, [Validators.required])
    })
  }

  onDelete(index: any) {

    const x = this.tempFeesArray[index];
    this.totalAmount = this.totalAmount - x.amount;
    this.tempTotalAmount = this.totalAmount;
    this.tempFeesArray.splice(index, 1);

  }
  clearFeesDiscount() {
    this.discountAmountNgModel=0;
    this.tempGetActiveCourseObj={};
    this.saveButtonBoolean=false;
    this.courseNameBoolean=false;
    this.transactionNoBoolean=false;
    this.feeAmountBoolean=false;
    this.isShown = false;
    this.hiddenPopup = false;
    this.hiddenPopupDiscount=false;
    this.FeesDiscountFormGroup.reset();
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    //this.studentsChargeDiscount = [];
    this.FeesDiscountFormGroup = new FormGroup({
      pay_discount: new FormControl(0, [Validators.required]),
      studentId: new FormControl(1, [Validators.required]),
      transactionId: new FormControl(0, [Validators.required]),
      transactionMasterId: new FormControl(1, [Validators.required]),
      comment: new FormControl(),
      amount: new FormControl(null, [Validators.required]),
      transactionDate: new FormControl(val),
      studentToCourseId: new FormControl(1, [Validators.required]),
      ledgerId: new FormControl(22, [Validators.required]),
    })
    
   
    this.totalAmount = 0;
    

  }
  changeCourseId() {
    this.courseNameBoolean=true;
    this.hiddenPopupDiscount=false;
    let studentId = this.FeesDiscountFormGroup.get('studentId')?.value;
    this.courseNameList = [];
    this.tempGetActiveCourseObj={};
    this.tranMasterIdArray = [];
    this.transactionNoBoolean=false;
    this.feeAmountBoolean=false;
    this.FeesDiscountFormGroup.patchValue({studentToCourseId:''});
    this.FeesDiscountFormGroup.patchValue({transactionMasterId:''});
    this.FeesDiscountFormGroup.patchValue({amount:''});
    this.tempGetActiveCourseObj={
      ledger_id: studentId,
      organisationId:this.organisationId
  };
    this.transactionServicesService.fetchAllStudentToCourses(this.tempGetActiveCourseObj).subscribe(response => {
      this.courseNameList = response.data;
    })
  }
  clear(table: Table) {
    table.clear();
  } 
  getEventValue($event:any) :string {
    return $event.target.value;
  }
  editFeesReceived(feeDetails: any) {
    this.selectedIndex = 0;
    this.hiddenPopup = false;
    this.event = 0;
    this.onTabChanged(this.event);
    this.isShown = true;
    this.tempFeesArray = [];
    this.totalAmount = 0;
    this.transactionServicesService.fetchAllTransaction(feeDetails.id).subscribe(response => {
      this.transactionList = response.data;
      this.transactionServicesService.fetchAllStudentToCourses(response.data[0].student_id).subscribe(response => {
        this.courseNameList = response.data;
      })
      this.FeesDiscountFormGroup.patchValue({ transactionId: response.data[0].id });
      this.FeesDiscountFormGroup.patchValue({ studentId: response.data[0].student_id });
      this.FeesDiscountFormGroup.patchValue({ studentToCourseId: response.data[0].student_course_registration_id });
      this.FeesDiscountFormGroup.patchValue({ comment: response.data[0].comment });
      this.FeesDiscountFormGroup.patchValue({ transactionDate: response.data[0].transaction_date });
      this.studentId = response.data[0].student_id;
      this.studentToCourseId = response.data[0].student_course_registration_id;
      this.transactionId = response.data[0].id;
      let tr_date = response.data[0].transaction_date;
      this.transactionDate = formatDate(tr_date, 'yyyy-MM-dd', 'en');
      this.comment = response.data[0].comment;

      for (let val of this.transactionList) {
        this.tempItemObj = {
          ledgerId: val.ledger_id,
          transactionTypeId: 2,
          feesName: val.ledger_name,
          amount: val.amount

        }
        this.tempFeesArray.push(this.tempItemObj);
        this.totalAmount = Number(this.totalAmount) + Number(val.amount);
      }

    })
  }

  onUpdate() {
    this.hiddenPopup = false;
    this.confirmationService.confirm({
      message: 'Do you want to Save this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {


        //let transactionId=this.FeesDiscountFormGroup.get('transactionId')?.value;
        //let studentId = this.FeesDiscountFormGroup.get('studentId')?.value;
        //let studentToCourseId = this.FeesDiscountFormGroup.get('studentToCourseId')?.value;
        //let tr_date=this.FeesDiscountFormGroup.get('transactionDate')?.value;
        //let transactionDate = formatDate(tr_date, 'yyyy-MM-dd', 'en');
        this.comment="Discount Allowed";
        let feesYear = new Date().getFullYear();
        let feesMonth = new Date().getMonth().toString();
        this.tempChargeObj = {
          ledgerId: this.studentId,
          transactionTypeId: 1,
          amount: this.totalAmount
        }
        this.tempFeesArray.push(this.tempChargeObj);

        this.tempObj = {
          transactionMaster: {
            userId: 1,
            studentCourseRegistrationId: this.studentToCourseId,
            transactionDate: this.transactionDate,
            comment: this.comment,
            feesYear: feesYear,
            feesMonth: feesMonth
          },
          transactionDetails: Object.values(this.tempFeesArray)
        }
        this.transactionServicesService.updateFeesCharge(this.transactionId, this.tempObj).subscribe(response => {
          if (response.success === 1) {
            this.getAllDiscountFees(this.organisationId);
            this.tempFeesArray = [];
            this.totalAmount = 0;
            this.clearFeesDiscount();
            this.showSuccess("Record Updated successfully");
          }

        }, error => {
          this.showErrorMessage = true;
          this.errorMessage = error.message;

          setTimeout(() => {
            this.showErrorMessage = false;
          }, 20000);

        })

      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });

  }

  getActiveCourse() {
   
    this.feeAmountBoolean=true;
    this.hiddenPopupDiscount = true;
    this.totalFees = 0;
    this.totalBilledAmount = 0;
    this.totalReceivedAmount = 0;
    this.totalDuedAmount = 0;
    this.totalDiscount=0;
    this.netDueAmount=0;
    this.discountAmountNgModel=0;

    

    //let studentId = this.FeesDiscountFormGroup.get('studentId')?.value;
    let transactionMasterId = this.FeesDiscountFormGroup.get('transactionMasterId')?.value;
    console.log("transactionMasterId:", transactionMasterId);

    this.tempGetActiveCourseObj={};
    this.tempGetActiveCourseObj={
        id: transactionMasterId,
        organisationId:this.organisationId
    };

    this.transactionServicesService.fetchFeesDueListId(this.tempGetActiveCourseObj).subscribe(response => {
      this.feesDueListArray = response.data;
      console.log("fees Due list:", this.feesDueListArray);
      this.totalReceivedAmount = this.feesDueListArray[0].total_received;
      console.log("totalReceivedAmount:", this.totalReceivedAmount);
      this.netDueAmount= this.feesDueListArray[0].total_due;
      console.log("netDueAmount:", this.netDueAmount);
      for (let val of this.feesDueListArray) {
        this.totalBilledAmount = this.totalBilledAmount + val.total_billed;
         console.log("total_billed:", val.total_billed);
              
      }
      this.tempGetActiveCourseObj={};
      this.tempGetActiveCourseObj={
          id: transactionMasterId,
          organisationId:this.organisationId
      };
      
      this.transactionServicesService.fetchDiscountByTranId(this.tempGetActiveCourseObj).subscribe(response => {
        this.discountTranIDArray = response.data;
        this.totalDiscount=this.discountTranIDArray[0].temp_total_discount;
        console.log("totalDiscount:",this.totalDiscount);
        this.discountAmountNgModel=this.netDueAmount;
        this.totalReceivedAmount = this.totalReceivedAmount -this.totalDiscount;
        console.log("totalReceivedAmount part 1:", this.totalReceivedAmount);
       /*  this.totalReceivedAmount=this.totalReceivedAmount+this.totalDiscount;
        console.log("totalReceivedAmount part 2:", this.totalReceivedAmount); */
        console.log("discountTranIDArray:",this.discountTranIDArray);
      })
      //this.totalReceivedAmount= this.totalReceivedAmount-this.totalDiscount;
      this.totalDuedAmount = this.totalBilledAmount - this.totalReceivedAmount;
      this.netDueAmount =this.totalDuedAmount;
      this.discountAmountNgModel=this.netDueAmount;
    })
    this.totalReceivedAmount = this.totalReceivedAmount -this.totalDiscount;
   

  }
 
 

  onSave() {
   /*  this.tempReceicedObj = {};
    this.tempFeesReceivedArray = []; */
    let TrId = this.FeesDiscountFormGroup.get('transactionMasterId')?.value;
    this.discountAmount = this.FeesDiscountFormGroup.get('amount')?.value;
    console.log("discountAmount:", this.discountAmount);
    console.log("TrId:", TrId);

    Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentId = this.FeesDiscountFormGroup.get('studentId')?.value;
        this.comment = this.FeesDiscountFormGroup.get('comment')?.value;
        if(!this.comment){
          this.comment="Discount Allowed";
        }
        let tr_date = this.FeesDiscountFormGroup.get('transactionDate')?.value;
        this.transactionDate = formatDate(tr_date, 'yyyy-MM-dd', 'en');
    
        var DateObj = new Date(this.transactionDate);
         this.transactionMonth=DateObj.getMonth()+1;
        this.transactionYear=DateObj.getFullYear(); 
        this.tempChargeObj = {
          ledgerId: this.studentId,
          transactionTypeId: 2,
          amount:this.discountAmount
        }
        this.tempReceicedObj = {
          ledgerId: 11,
          transactionTypeId: 1,
          amount: this.discountAmount
        }
        this.tempFeesReceivedArray.push(this.tempReceicedObj);
        this.tempFeesReceivedArray.push(this.tempChargeObj);
        this.tempObj = {
          transactionMaster: {
            userId: 1,
            referenceTransactionMasterId:TrId,
            transactionDate: this.transactionDate,
            comment: this.comment,
            feesYear: this.transactionYear,
            feesMonth: this.transactionMonth,
            organisationId:this.organisationId
          },
          transactionDetails: Object.values(this.tempFeesReceivedArray)
        }
        this.transactionServicesService.saveFeesReceive(this.tempObj).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Fees Discount has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.FeesDiscountFormGroup.reset();
            this.getAllDiscountFees(this.organisationId);
            this.feesDueListArray = [];
            this.totalAmount=0;
            this.clearFeesDiscount();
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

  }
  showSuccess(arg0: string) {
    throw new Error('Method not implemented.');
  }

}

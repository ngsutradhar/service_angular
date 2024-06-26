import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { CommonService } from 'src/app/services/common.service';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToWords } from 'to-words';
import { Table } from 'primeng/table/table';
import Swal from 'sweetalert2'
import { tree } from 'd3';


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
  selector: 'app-fees-received',
  templateUrl: './fees-received.component.html',
  styleUrls: ['./fees-received.component.scss'],
  providers: [ConfirmationService, MessageService]
})

export class FeesReceivedComponent implements OnInit {
  UserID: number = 0;
  organisationId: number = 0;
  organisationName: string = '';
  organisationAddress: string = '';
  organisationPin: string = '';
  organisationContact: string = '';
  organisationEmail: string = '';
  isReadonly = false;

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

  totalCourseAmount:number=0;
  transactionMonth: any;
  transactionYear: any;
  checked = false;
  isPrintBoolean: boolean = false;
  isDeviceXS = false;
  indeterminate = false;
  totalCourseDue: number = 0;
  totalCurrentDue: number = 0;
  transactionId: number = 0;

  voucherTypeId:number=0;
  isUpdateBtnShown:boolean=false;
  courseNameBoolean: boolean = false;
  transactionNoBoolean: boolean = false;
  hiddenTransactionInfo: boolean = false;
  feeNameBoolean: boolean = false;
  advancedBoolean: boolean = true;

  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  transactionMasterId: number = 0;
  hiddenPopup: boolean = false;
  selectedIndex: number = 0;
  totalRecepitAmount: number = 0;
  totalFees: number = 0;
  totalDue: number = 0;
  feesDueListArray: any[] = [];
  feesReceivedDetailsArray: any[] = [];
  hiddenInput: boolean = false;
  showBox: boolean = true;
  showReceipt: boolean = false;
  isShown: boolean = false; // hidden by default
  isPopupButton: boolean = false;
  isCashReceived: boolean = false;
  referenceTransactionMasterId: number = 0;
  students: any[] = [];

  studentToCourseId: any;
  totalBilledAmount: number = 0;
  totalReceivedAmount: number = 0;
  receivedGrandTotal: number = 0;
  totalDiscount: number = 0;
  netDueAmount: number = 0;
  netDueAmountValidation: number = 0;
  totalDuedAmount: number = 0;
  totalDuefeesByLedgerId: number = 0;
  studentNameList: any[] = [];
  FeesReceivedFormGroup: FormGroup | any;
  BankReceivedFormGroup: FormGroup | any;
  feesNameList: any[] = [];
  courseNameList: any = [];
  transactionList: any = [];
  tempFeesReceivedArray: any = [];
  feesReceivedArray: any = [];
  feesDiscountArray: any = [];
  dueFeesLedgerArray: any = [];

  tranMasterIdArray: any[] = [];
  discountTranIDArray: any[] = [];
  singleBillReceiptArray: any[] = [];
  organizationArray: any[] = [];
  allAdvancedReceivedHistoryArray: any[]=[];
  allBillReceiptArray: any[] = [];
  rupeeInWords: string = '';
  tempFeesArray: any[] = [];

  studentId: any;
  transactionDate: any;
  advTransactionDate:string='';
  tempGetActiveCourseObj!: object;
  tempItemObj!: object;
  tempSaveItemObj!: object;
  tempObj!: object;
  tempChargeObj!: object;
  tempReceicedObj!: object;
  tempReceicedObj_1!: object;
  tempCashChargeObj!: object;
  courses: any[] = [];
  popUpRestultArray: any[] = [];
  ledgerId: number = 0;
  amount: number = 0;
  event: number = 0;
  tempTotalAmount: number = 0;
  totalAmount: number = 0;
  removeTotalAmount: number = 0;
  description:string='';
  totalAdvanced:number=0;
  totalAdvReceived:number=0;
  advancedDue:number=0;

  referenceReceivedTransactionMasterId:number=0;

  showErrorMessage: boolean | undefined;
  errorMessage: any;
  msgs: { severity: string; summary: string; detail: string; }[] | undefined;
  animal: any;
  datepipe!: DatePipe;

  isInputField: boolean = false;


  constructor(private transactionServicesService: TransactionServicesService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    public commonService: CommonService,
    public dialog: MatDialog) {
    this.activatedRoute.data.subscribe((response: any) => {
      this.studentNameList = response.feesReceivedResolver.students.data;
      this.feesNameList = response.feesReceivedResolver.feesNames.data;
    });
    this.isDeviceXS = commonService.getDeviceXs();
    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }
  }

  ngOnInit(): void {
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.FeesReceivedFormGroup = new FormGroup({
      comment: new FormControl(null, [Validators.required]),
      studentId: new FormControl(1, [Validators.required]),
      transactionMasterId: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      transactionDate: new FormControl(val),
      studentToCourseId: new FormControl(1, [Validators.required]),
      ledgerId: new FormControl(1, [Validators.required]),
      transactionId: new FormControl(0, [Validators.required]),
     
    })

    this.BankReceivedFormGroup = new FormGroup({
      accountNo: new FormControl(null, [Validators.required]),
      ifscNo: new FormControl(null, [Validators.required]),
      branch: new FormControl(null, [Validators.required])
    })



    this.getAllReceivedFees(this.organisationId);

  }
  feesPurpose: string[] = ['Admission fees',
    'Advanced fees',
    'Course fees',
    'Monthly fees',
    'Tuition fees',
    'Others fees',
    'Uniform fees',
    'ID Card fees',
    'Stationery fees',
    'Late fees',
    '1st Installment',
    '2nd Installment',
    '3rd Installment',
    '4th Installment',
    '5th Installment',
    '6th Installment',
    '7th Installment',
    '8th Installment',
    '9th Installment',
    '10th Installment',
    '11th Installment',
    '12th Installment',
    '13th Installment',
    '14th Installment',
    'Clear Fees',
  ];
  receiptMode: Array<{ id: number, name: string }> = [
    { id: 1, name: "Cash" },
    { id: 2, name: "Bank" }
  ];
  receivedAmount: number = 0;
  receivedComments: string = '';
  numTransactionLength:string='';
  active = 0;
  onTabChanged(event: any) {
    this.event = event;
    //console.log("Tab id:",event.tab);
    console.log("Tab id:", this.event)
    //if(event===1)
  }

  onInput(){
    if((this.receivedComments!='') && (this.numTransactionLength!='')){
      this.isInputField=true;
    }
    else{
      this.isInputField=false;
    }
  }

  onClickedReceiptVoucher(fees: any) {
    this.totalRecepitAmount = 0;
    this.rupeeInWords = '';
    this.showReceipt = true;
    this.selectedIndex = 2;
    this.transactionServicesService.fetchOrganizationDetails(this.organisationId).subscribe(response => {
      this.organizationArray = response.data;
      console.log("organizationArray:", this.organizationArray);
      this.organisationName = response.data[0].organisation_name;
      this.organisationAddress = response.data[0].address;
      this.organisationPin = response.data[0].pin;
      this.organisationEmail = response.data[0].email_id;
      this.organisationContact = response.data[0].whatsapp_number;
      console.log("organisation_name:", this.organisationName);
    })
    console.log("id:", fees.student_course_registration_id);
    this.tempGetActiveCourseObj = {};
    this.tempGetActiveCourseObj = {
      id: fees.student_course_registration_id,
      organisationId: this.organisationId
    };
    this.transactionServicesService.fetchAllReceipt(this.tempGetActiveCourseObj).subscribe(response => {
      this.allBillReceiptArray = response.data;
      this.billing_name = this.allBillReceiptArray[0].billing_name;
      this.whatsapp_number = this.allBillReceiptArray[0].whatsapp_number;
      this.full_name = this.allBillReceiptArray[0].full_name;
      this.total_course_fees = this.allBillReceiptArray[0].total_course_fees;
      this.transaction_date = this.allBillReceiptArray[0].transaction_date;
      this.transaction_number = this.allBillReceiptArray[0].transaction_number;
      this.total_discount = this.allBillReceiptArray[0].total_discount;
      console.log("Array:", this.allBillReceiptArray);
      for (let val of this.allBillReceiptArray) {
        this.totalRecepitAmount = Number(this.totalRecepitAmount) + Number(val.temp_total_received);
      }
      this.rupeeInWords = toWords.convert(this.totalRecepitAmount);
    })

  }

  onSingleReceiptVoucher() {
    this.selectedIndex = 1;
    this.showBox = false;
    //console.log("id:", feeDetails.id);
    this.transactionServicesService.fetchOrganizationDetails(this.organisationId).subscribe(response => {
      this.organizationArray = response.data;
      console.log("organizationArray:", this.organizationArray);
      this.organisationName = response.data[0].organisation_name;
      this.organisationAddress = response.data[0].address;
      this.organisationPin = response.data[0].pin;
      this.organisationEmail = response.data[0].email_id;
      this.organisationContact = response.data[0].whatsapp_number;
      console.log("organisation_name:", this.organisationName);
    })

    this.tempGetActiveCourseObj = {};
    this.tempGetActiveCourseObj = {
      id: this.transactionId,
      organisationId: this.organisationId
    };
    this.transactionServicesService.fetchSingleReceipt(this.tempGetActiveCourseObj).subscribe(response => {
      this.singleBillReceiptArray = response.data;
      console.log("Array:", this.singleBillReceiptArray);
      this.billing_name = this.singleBillReceiptArray[0].billing_name;
      this.whatsapp_number = this.singleBillReceiptArray[0].whatsapp_number;
      this.full_name = this.singleBillReceiptArray[0].full_name;
      this.total_course_fees = this.singleBillReceiptArray[0].total_course_fees;
      this.transaction_date = this.singleBillReceiptArray[0].transaction_date;
      this.transaction_number = this.singleBillReceiptArray[0].transaction_number;
      this.ledger_name = this.singleBillReceiptArray[0].ledger_name;
      this.temp_total_received = this.singleBillReceiptArray[0].temp_total_received;
      this.comment = this.singleBillReceiptArray[0].comment;
      this.rupeeInWords = toWords.convert(this.singleBillReceiptArray[0].temp_total_received);
    })

  }
  onClickedClosed() {
    this.selectedIndex = 0;
  }
  onClickedSingleReceipt(feeDetails: any) {
    if (this.showBox === false) {
      this.showBox = !this.showBox;
      this.event = 0;
    }
    else {
      this.showBox = false;
      console.log("id:", feeDetails.id);
      this.tempGetActiveCourseObj = {};
      this.tempGetActiveCourseObj = {
        id: feeDetails.id,
        organisationId: this.organisationId
      };
      this.transactionServicesService.fetchOrganizationDetails(this.organisationId).subscribe(response => {
        this.organizationArray = response.data;
        console.log("organizationArray:", this.organizationArray);
        this.organisationName = response.data[0].organisation_name;
        this.organisationAddress = response.data[0].address;
        this.organisationPin = response.data[0].pin;
        this.organisationEmail = response.data[0].email_id;
        this.organisationContact = response.data[0].whatsapp_number;
        console.log("organisation_name:", this.organisationName);
      })
      this.transactionServicesService.fetchSingleReceipt(this.tempGetActiveCourseObj).subscribe(response => {
        this.singleBillReceiptArray = response.data;
        console.log("Array:", this.singleBillReceiptArray);
        this.billing_name = this.singleBillReceiptArray[0].billing_name;
        this.whatsapp_number = this.singleBillReceiptArray[0].whatsapp_number;
        this.full_name = this.singleBillReceiptArray[0].full_name;
        this.total_course_fees = this.singleBillReceiptArray[0].total_course_fees;
        this.transaction_date = this.singleBillReceiptArray[0].transaction_date;
        this.transaction_number = this.singleBillReceiptArray[0].transaction_number;
        this.ledger_name = this.singleBillReceiptArray[0].ledger_name;
        this.temp_total_received = this.singleBillReceiptArray[0].temp_total_received;
        this.comment = this.singleBillReceiptArray[0].comment;
        this.rupeeInWords = toWords.convert(this.singleBillReceiptArray[0].temp_total_received);
      })

    }
  }
  getAllReceivedFees($orgID: any) {
    this.transactionServicesService.fetchAllFeesReceived($orgID).subscribe(response => {
      this.feesReceivedArray = response.data;
    })
  }

  getAllStudent($orgID: any) {
    this.transactionServicesService.fetchAllStudentName($orgID).subscribe(response => {
      this.studentNameList = response.data;
    })
  }
  clear(table: Table) {
    table.clear();
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  onAddFees() {
    this.ledgerId = this.FeesReceivedFormGroup.get('ledgerId')?.value;
    this.amount = this.FeesReceivedFormGroup.get('amount')?.value;
    this.totalAmount = Number(this.totalAmount) + Number(this.amount);
    const tempItem = this.FeesReceivedFormGroup.value;
    let index = this.feesNameList.findIndex((x: { id: any; }) => x.id === tempItem.ledgerId);
    this.tempItemObj = {
      ledgerId: this.ledgerId,
      transactionTypeId: 2,
      feesName: this.feesNameList[index].ledger_name,
      amount: this.amount
    }
    this.tempFeesArray.push(this.tempItemObj);
    this.tempTotalAmount = this.totalAmount;
  }
  onDelete(index: any) {

    const x = this.tempFeesArray[index];
    this.totalAmount = this.totalAmount - x.amount;
    this.tempTotalAmount = this.totalAmount;
    this.tempFeesArray.splice(index, 1);

  }
  clearFeesReceived() {
    this.hiddenPopup = false;
    this.numTransactionLength='';
    this.hiddenTransactionInfo = false;
    this.isReadonly = false;
    this.isUpdateBtnShown=false;
    this.isPrintBoolean=false;
    //this.isPrintBoolean=false;
    //this.studentNameList = [];
    this.tempGetActiveCourseObj = {};
    this.courseNameList = [];
    this.tranMasterIdArray = [];
    this.feesDueListArray = [];
    this.courseNameBoolean = false;
    this.transactionNoBoolean = false;
    this.feeNameBoolean = false;
    this.isShown = false;
    this.FeesReceivedFormGroup.reset();
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.FeesReceivedFormGroup = new FormGroup({
      transactionId: new FormControl(0, [Validators.required]),
      studentId: new FormControl(1, [Validators.required]),
      comment: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      transactionDate: new FormControl(val),
      studentToCourseId: new FormControl(1, [Validators.required]),
      ledgerId: new FormControl(1, [Validators.required]),
      transactionMasterId: new FormControl(null, [Validators.required])
    })
    this.BankReceivedFormGroup = new FormGroup({
      accountNo: new FormControl(null, [Validators.required]),
      ifscNo: new FormControl(null, [Validators.required]),
      branch: new FormControl(null, [Validators.required])
    })
    this.tempFeesArray = [];
    this.totalAmount = 0;
  }
  changeCourseId() {
    this.courseNameBoolean = true;
    this.transactionNoBoolean = false;
    this.feeNameBoolean = false;
    this.hiddenTransactionInfo=false;
    this.tempGetActiveCourseObj = {};
    this.tranMasterIdArray = [];
    this.FeesReceivedFormGroup.patchValue({ studentToCourseId: '' });
    this.FeesReceivedFormGroup.patchValue({ transactionMasterId: '' });
    this.FeesReceivedFormGroup.patchValue({ amount: '' });

    this.courseNameList = [];
    let studentId = this.FeesReceivedFormGroup.get('studentId')?.value;
    //this.courseNameList = [];
    this.tempGetActiveCourseObj = {
      ledger_id: studentId,
      organisationId: this.organisationId
    };
    this.transactionServicesService.fetchAllStudentToCourses(this.tempGetActiveCourseObj).subscribe(response => {
      this.courseNameList = response.data;
    })
   this.getAllAdvancedReceivedLedgerId(studentId);
  
  }
  getAllAdvancedReceivedLedgerId($id: any) {
    this.voucherTypeId=0;
    this.advancedBoolean = true;
    this.transactionDate='';
    this.transactionServicesService.fetchAllAdvancedReceivedLedgerId($id).subscribe(response => {
      this.allAdvancedReceivedHistoryArray = response.data;
      this.voucherTypeId=this.allAdvancedReceivedHistoryArray[0].voucher_type_id;
      this.advTransactionDate=this.allAdvancedReceivedHistoryArray[0].transaction_date;
      this.description=this.allAdvancedReceivedHistoryArray[0].comment;
      this.totalAdvanced=this.allAdvancedReceivedHistoryArray[0].amount;
      this.totalAdvReceived=this.allAdvancedReceivedHistoryArray[0].advanced_received;
      this.advancedDue=this.allAdvancedReceivedHistoryArray[0].adv_due;
      if(this.voucherTypeId===10){
        this.advancedBoolean = false;
        this.hiddenPopup=false;
       }else{
        this.advancedBoolean = true;
        this.hiddenPopup=true;
       }
      console.log("allAdvancedReceivedHistoryArrayByLedgerId:", this.allAdvancedReceivedHistoryArray);
    })
  }
  editFeesReceived(feeDetails: any) {
    this.referenceReceivedTransactionMasterId=0;
    this.FeesReceivedFormGroup.reset();
    console.log("id:", feeDetails.id);
    this.hiddenInput=false;
    this.isUpdateBtnShown=true;
    this.selectedIndex = 0;
    this.courseNameBoolean=true;
    this.transactionNoBoolean=true;
    this.hiddenTransactionInfo=false;
    this.isReadonly = true;
    this.feeNameBoolean=true;
    this.onTabChanged(this.event);
    this.isShown = true;
    this.tempFeesArray = [];
    this.totalAmount = 0;
    this.tempGetActiveCourseObj = {};
   
    this.tempGetActiveCourseObj = {
      organisationId: this.organisationId,
      id: feeDetails.id
    };
    this.transactionServicesService.fetchReceivedEdit(this.tempGetActiveCourseObj).subscribe(response => {
      this.transactionList = response.data;
      console.log("array Received Edit:", this.transactionList);
      this.studentToCourseId=response.data[0].student_course_registration_id;
      if(response.data[0].reference_received_transaction_master_id>0){
        this.referenceReceivedTransactionMasterId=response.data[0].reference_received_transaction_master_id;
      }else{
        this.referenceReceivedTransactionMasterId=0;
      }
      

      this.FeesReceivedFormGroup.patchValue({ transactionId: response.data[0].transaction_master_id });
      this.FeesReceivedFormGroup.patchValue({ studentId: response.data[0].studentId });
      this.FeesReceivedFormGroup.patchValue({ studentToCourseId: response.data[0].student_course_registration_id });
      this.FeesReceivedFormGroup.patchValue({ comment: response.data[0].comment });
      this.FeesReceivedFormGroup.patchValue({ ledgerId: response.data[0].ledgerId }); 
      this.FeesReceivedFormGroup.patchValue({ transactionMasterId: response.data[0].reference_transaction_master_id }); 
      this.FeesReceivedFormGroup.patchValue({ amount: response.data[0].received_amount }); 
      this.FeesReceivedFormGroup.patchValue({ transactionDate: response.data[0].transaction_date }); 

      this.tempGetActiveCourseObj = {};
      this.tempGetActiveCourseObj = {
        organisationId: this.organisationId,
        ledger_id: response.data[0].studentId
      };
      this.transactionServicesService.fetchAllStudentToCourses(this.tempGetActiveCourseObj).subscribe(response => {
        this.courseNameList = response.data;

        this.tempGetActiveCourseObj = {};
         this.tempGetActiveCourseObj = {
        organisationId: this.organisationId,
        id: this.studentToCourseId
      };
        this.transactionServicesService.fetchAllUpdateTranMasterId(this.tempGetActiveCourseObj).subscribe(response => {
          this.tranMasterIdArray = response.data;
          console.log("tranMasterIdArray:",this.tranMasterIdArray);
          //console.log("tranMasterIdArray:",this.tranMasterIdArray);
          //--------------------------Start----------------------
         
          //--------------------------End -----------------------
        })

      })
      this.feesDueListArray=[];
      this.totalCourseAmount=0;
      this.netDueAmount=0;
      this.totalReceivedAmount=0;
      this.tempGetActiveCourseObj = {};
      this.tempGetActiveCourseObj = {
        id: response.data[0].reference_transaction_master_id,
        organisationId: this.organisationId
      };
      this.transactionServicesService.fetchFeesDueListEditId(this.tempGetActiveCourseObj).subscribe(response => {
        this.feesDueListArray = response.data;
        console.log("fees Due list:", this.feesDueListArray);
        this.totalReceivedAmount = this.feesDueListArray[0].total_received;
        this.netDueAmount = this.feesDueListArray[0].total_due;
        this.totalCourseAmount= this.totalReceivedAmount+this.netDueAmount;
        console.log("totalCourseAmount:", this.totalCourseAmount);
      })
   })
  }

  onUpdate() {
    this.tempReceicedObj = {};
    this.tempReceicedObj_1 = {};
    this.tempFeesReceivedArray = [];
    let mode;
    let transactionId = this.FeesReceivedFormGroup.get('transactionId')?.value;
    let studentId = this.FeesReceivedFormGroup.get('studentId')?.value;
    let studentToCourseId = this.FeesReceivedFormGroup.get('studentToCourseId')?.value;
    let tr_date = this.FeesReceivedFormGroup.get('transactionDate')?.value;
    let transactionDate = formatDate(tr_date, 'yyyy-MM-dd', 'en');
    let comment = this.FeesReceivedFormGroup.get('comment')?.value;
    this.amount = this.FeesReceivedFormGroup.get('amount')?.value;
    this.ledgerId = this.FeesReceivedFormGroup.get('ledgerId')?.value;
    if (this.ledgerId === 1) {
      mode = 'Cash'
    } else {
      mode = 'Bank'
    }
    Swal.fire({
      title: 'Are you sure?',
      html: '<pre> Date:' + transactionDate + '</pre>' + '<br><pre> Amount:' + this.amount + '</pre>' + '<br><pre>Payment Mode:' + mode + '</pre>',
      text: ' Update This Record...?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {

        this.tempReceicedObj = {
          ledgerId: studentId,
          transactionTypeId: 2,
          amount: this.amount
        };
        this.tempReceicedObj_1 ={
          ledgerId: this.ledgerId,
          transactionTypeId: 1,
          amount: this.amount
        }
        this.tempFeesReceivedArray.push(this.tempReceicedObj);
        this.tempFeesReceivedArray.push(this.tempReceicedObj_1);

        this.tempObj = {
          transactionMaster: {
            userId: this.UserID,
            transactionDate: transactionDate,
            comment: comment
          },
          transactionDetails: Object.values(this.tempFeesReceivedArray)
        }
        console.log("tran:", transactionId);

        this.transactionServicesService.updateFeesReceived(transactionId, this.tempObj).subscribe(response => {
          if (response.success === 1) {
            this.transactionId = response.data.transactionMasterId;
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Fees Received has been Updated',
              showConfirmButton: false,
              timer: 1500
            });
            this.isPrintBoolean = true;
            this.FeesReceivedFormGroup.reset();
            //this.getActiveCourseUpdate();
            this.clearFeesReceived();
            this.isPrintBoolean = true;
            this.getAllReceivedFees(this.organisationId);
            this.feesDueListArray = [];
            this.totalAmount = 0;
            this.getAllStudent(this.organisationId);
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





  onSave() {
    let mode;
    this.tempReceicedObj = {};
    this.tempFeesReceivedArray = [];
    this.transactionMasterId = this.FeesReceivedFormGroup.get('transactionMasterId')?.value;
    let tr_date = this.FeesReceivedFormGroup.get('transactionDate')?.value;
    this.amount = this.FeesReceivedFormGroup.get('amount')?.value;
    this.ledgerId = this.FeesReceivedFormGroup.get('ledgerId')?.value;
    if (this.ledgerId === 1) {
      mode = 'Cash'
    } else {
      mode = 'Bank'
    }
    this.transactionDate = formatDate(tr_date, 'yyyy-MM-dd', 'en');
    console.log("TrId.", this.transactionMasterId);
    console.log("amount.", this.amount);
    console.log("ledgerId.", this.ledgerId);
    Swal.fire({
      title: 'Are you sure?',
      html: '<pre> Date:' + this.transactionDate + '</pre>' + '<br><pre> Amount:' + this.amount + '</pre>' + '<br><pre>Payment Mode:' + mode + '</pre>',
      text: ' Save This Record...?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {


        this.studentId = this.FeesReceivedFormGroup.get('studentId')?.value;


        var DateObj = new Date(this.transactionDate);
        this.transactionMonth = DateObj.getMonth() + 1;
        this.transactionYear = DateObj.getFullYear();
        console.log("Month No:", DateObj.getMonth() + 1);
        console.log("Year No:", DateObj.getFullYear());
        this.comment = this.FeesReceivedFormGroup.get('comment')?.value;
        if (!this.comment) {
          this.comment = "Fees Received";
        }

        this.tempChargeObj = {
          ledgerId: this.studentId,
          transactionTypeId: 2,
          amount: this.amount
        }
        this.tempReceicedObj = {
          ledgerId: this.ledgerId,
          transactionTypeId: 1,
          amount: this.amount
        }

        this.tempFeesReceivedArray.push(this.tempReceicedObj);


        this.tempFeesReceivedArray.push(this.tempChargeObj);
        this.tempObj = {
          transactionMaster: {
            userId: this.UserID,
            referenceTransactionMasterId: this.studentToCourseId,
            transactionDate: this.transactionDate,
            comment: this.comment,
            feesYear: this.transactionYear,
            feesMonth: this.transactionMonth,
            organisationId: this.organisationId
          },
          transactionDetails: Object.values(this.tempFeesReceivedArray)
        }
        this.transactionServicesService.saveFeesReceive(this.tempObj).subscribe(response => {
          if (response.success === 1) {
            this.transactionId = response.data.transactionMasterId;
            
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Fees Received has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            
           
            this.FeesReceivedFormGroup.reset();
            //this.getActiveCourseUpdate();
            this.clearFeesReceived();
            this.isPrintBoolean = true;
            this.getAllReceivedFees(this.organisationId);
            this.feesDueListArray = [];
            this.totalAmount = 0;
            this.getAllStudent(this.organisationId);
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
  getTranMasterId() {
    this.transactionNoBoolean = true;
    this.feeNameBoolean = false;
    this.hiddenPopup = true;
    this.receivedGrandTotal = 0;
    this.totalCourseDue = 0;
    this.totalCurrentDue = 0;
    this.feesReceivedDetailsArray = [];
    this.tranMasterIdArray = [];
    this.tempGetActiveCourseObj = {};
    this.FeesReceivedFormGroup.patchValue({ transactionMasterId: '' });
    let studentToCourseId = this.FeesReceivedFormGroup.get('studentToCourseId')?.value;
    console.log("studentToCourseId:", studentToCourseId);
    this.tempGetActiveCourseObj = {
      id: studentToCourseId,
      organisationId: this.organisationId
    };
    this.transactionServicesService.fetchAllTranMasterId(this.tempGetActiveCourseObj).subscribe(response => {
      this.tranMasterIdArray = response.data;
      console.log("tranMasterIdArray:",this.tranMasterIdArray);
    })

    this.transactionServicesService.fetchFeeReceivedDetailsList(this.tempGetActiveCourseObj).subscribe(response => {
      this.feesReceivedDetailsArray = response.data;
      console.log("feesReceivedDetailsArray:", this.feesReceivedDetailsArray);
      this.totalCourseDue = this.feesReceivedDetailsArray[0].totalDue;
      for (let val of this.feesReceivedDetailsArray) {
        this.receivedGrandTotal = this.receivedGrandTotal + val.temp_total_received;
      }
      this.totalCurrentDue = this.totalCourseDue - this.receivedGrandTotal;

    })
  }

  getActiveCourse(id: any) {
    this.feeNameBoolean = true;
    this.studentToCourseId = id.id;
    console.log("total_received:", id);
    this.hiddenTransactionInfo = true;
    this.totalFees = 0;
    this.totalBilledAmount = 0;
    this.totalReceivedAmount = 0;
    this.totalDuedAmount = 0;
    this.totalDiscount = 0;
    this.netDueAmount = 0;
    this.netDueAmountValidation = 0;
    this.totalFees = 0;
    this.feesDueListArray = [];
    //let studentId = this.FeesChargeFormGroup.get('studentId')?.value;
    let transactionMasterId = id.id;
    console.log("transactionMasterId:", transactionMasterId);
    this.tempGetActiveCourseObj = {};
    this.tempGetActiveCourseObj = {
      id: transactionMasterId,
      organisationId: this.organisationId
    };
    this.transactionServicesService.fetchFeesDueListId(this.tempGetActiveCourseObj).subscribe(response => {
      this.feesDueListArray = response.data;
      console.log("fees Due list:", this.feesDueListArray);
      this.totalReceivedAmount = this.feesDueListArray[0].total_received;
      this.netDueAmount = this.feesDueListArray[0].total_due;
      //---------------------------------- auto fill amount---------------

      this.receivedAmount = this.netDueAmount;

      //------------------------------------
      for (let val of this.feesDueListArray) {
        this.totalBilledAmount = this.totalBilledAmount + val.total_billed;
        console.log("total_billed:", val.total_billed);
        //console.log("total_received:", val.total_received);

      }

      this.totalDuedAmount = this.totalBilledAmount - this.totalReceivedAmount;
      this.netDueAmount = this.totalDuedAmount;
      this.receivedAmount = this.netDueAmount;
      this.receivedComments = "Tuition Fees"
      this.netDueAmountValidation = this.netDueAmount - 1;
    })
  }
  getActiveCourseUpdate() {

    this.transactionMasterId = this.FeesReceivedFormGroup.get('transactionMasterId')?.value;
    console.log("transactionMasterId:", this.studentToCourseId);
    this.hiddenPopup = true;
    this.totalFees = 0;
    this.totalBilledAmount = 0;
    this.totalReceivedAmount = 0;
    this.totalDuedAmount = 0;
    this.totalDiscount = 0;
    this.netDueAmount = 0;
    //let studentId = this.FeesChargeFormGroup.get('studentId')?.value;
    //let transactionMasterId = id.id;
    //console.log("transactionMasterId:", transactionMasterId);
    this.transactionServicesService.fetchFeesDueListId(this.transactionMasterId).subscribe(response => {
      this.feesDueListArray = response.data;
      console.log("fees Due list:", this.feesDueListArray);
      for (let val of this.feesDueListArray) {
        this.totalBilledAmount = this.totalBilledAmount + val.total_billed;
        this.totalReceivedAmount = this.totalReceivedAmount + val.total_received;
        console.log("total_billed:", val.total_billed);
        console.log("total_received:", val.total_received);

      }
      this.transactionServicesService.fetchDiscountByTranId(this.transactionMasterId).subscribe(response => {
        this.discountTranIDArray = response.data;
        this.totalDiscount = this.discountTranIDArray[0].temp_total_discount;
        this.netDueAmount = this.totalDuedAmount - this.totalDiscount;
        console.log("discountTranIDArray:", this.discountTranIDArray);
      })
      this.totalDuedAmount = this.totalBilledAmount - this.totalReceivedAmount;
      this.netDueAmount = this.totalDuedAmount;
    })
  }
}

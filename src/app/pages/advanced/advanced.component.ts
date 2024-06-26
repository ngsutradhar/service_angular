import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { Table } from 'primeng/table/table';
import { CommonService } from 'src/app/services/common.service';
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
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class AdvancedComponent implements OnInit {
  advReceivedHiddenInputBoolean:boolean=false;
  selectedIndex: number = 0;
  UserID: number = 0;
  organisationId: number = 0;
  organisationName: string = '';
  organisationAddress: string = '';
  organisationPin: string = '';
  organisationContact: string = '';
  organisationEmail: string = '';
  isReadonly = false;
  event: number = 0;
  studentNameList: any[] = [];
  advancedDetailsArray: any[] = [];
  allAdvancedDetailsArray: any[] = [];
  allAdvReceivedAdjustmentArray: any[] = [];
  feesNameList: any[] = [];
  courseNameList: any = [];
  receivedAmount: number = 0;
  isDeviceXS = false;
  tempGetActiveCourseObj!: object;
  tempReceicedObj!: object;
  tempReceiceAdjustmentdObj!: object;
  ledgerId: any;
  amount: number = 0;
  comment: string = '';
  transactionDate: any;
  transactionDateAdv: string = '';
  transactionMonth: number = 0;
  transactionYear: number = 0;
  fullName: any;
  studentCourseRegistrationId: any;
  adjustmentStudentCourseRegistrationId: any;
  mode: any;
  studentToCourseRegisterId: any;
  totalAdvanced: number = 0;
  receivedAdvanced: number = 0;
  advancedDue: number = 0;
  totalCourseDue: number = 0;
  totalCurrentDue: number = 0;
  courseName: string = '';
  receivedGrandTotal: number = 0;
  feesReceivedDetailsArray: any[] = [];
  tranMasterIdArray: any[] = [];
  allAdvancedReceivedHistoryArray:any[]=[];
  allAdvancedReceivedHistoryByIdArray:any[]=[];
  hiddenTransactionInfo: boolean = false;
  hiddenAdvReceived: boolean = false;
  hiddenEachTranDetails: boolean = false;
  AdvancedFeesReceivedFormGroup: FormGroup | any;
  AdvancedAdjustmentFeesReceivedFormGroup: FormGroup | any;
  referenceReceivedTransactionMasterId:any;
  transactionMasterId:any;
  adjustmentStudentId:any;
  courseNameBoolean : boolean = false;
  transactionNoBoolean : boolean = false;
  studentNameBoolean : boolean = false;
  advAmountBoolean : boolean = false;
  advCourseNameBoolean : boolean = false;
  advCommentsBoolean : boolean = false;
  AdvshowReceiptBoolean:boolean=false;
  organizationArray: any[]=[];
  editAdvReceivedArray:any[]=[];

  advReceivedTransactionId:number=0;
  advComments:string='';
  advTranDate:string='';
  whatsapp_number: string = '';
  billing_name: string = '';
  full_name: any;
  ledger_name: any;
  total_advanced:number=0;
  received_advanced:number=0;
  advanced_due:number=0;
  transaction_date: any;
  transaction_number: any;
  total_discount: any;
  temp_total_received: any;
  totalRecepitAdvAmount:number=0;
  rupeeInWords:string='';
  //studentCourseRegistrationId:number=0;
  constructor(private transactionServicesService: TransactionServicesService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    public commonService: CommonService) {
    this.activatedRoute.data.subscribe((response: any) => {
      this.studentNameList = response.feesReceivedResolver.students.data;
      /* this.feesNameList = response.feesReceivedResolver.feesNames.data; */
    });
    this.isDeviceXS = commonService.getDeviceXs();
    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }
    this.getAdvStudentName(this.organisationId);
    this.getAllAdvReceived(this.organisationId);
    this.getAllAdvancedReceivedHistory(this.organisationId);
    this.getAllAdvReceivedAdjustment(this.organisationId);
  }

  ngOnInit(): void {
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.AdvancedFeesReceivedFormGroup = new FormGroup({
      comment: new FormControl(null, [Validators.required]),
      studentId: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      transactionDate: new FormControl(val),
      studentToCourseId: new FormControl(null, [Validators.required]),
      ledgerId: new FormControl(1, [Validators.required]),
      transactionId: new FormControl(0, [Validators.required])

    })
    this.AdvancedAdjustmentFeesReceivedFormGroup = new FormGroup({
      adjuestmenTtransactionDate: new FormControl(val, [Validators.required]),
      referenceReceivedTransactionMasterId: new FormControl(null, [Validators.required]),
      adjustmentStudentId: new FormControl(null, [Validators.required]),
      adjustmentStudentToCourseId: new FormControl(null, [Validators.required]),
      transactionMasterId: new FormControl(null, [Validators.required]),
    })
  }
  active = 0;
  onTabChanged(event: any) {
    this.event = event;
    //console.log("Tab id:",event.tab);
    console.log("Tab id:", this.event)
    //if(event===1)
  }
  receiptMode: Array<{ id: number, name: string }> = [
    { id: 1, name: "Cash" },
    { id: 2, name: "Bank" }
  ];

  clear(table: Table) {
    table.clear();
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  
  AdvancedreceivedComments: string = 'Received Advanced Fees: For the Month of Feb to Apr 2023';

  changeCourseId() {
    this.advAmountBoolean = false;
    this.transactionNoBoolean = false;
    this.advCommentsBoolean=false;
    this.advCourseNameBoolean = true; 
    this.hiddenTransactionInfo=false;
    this.tempGetActiveCourseObj = {};
    this.tranMasterIdArray = [];
    this.AdvancedFeesReceivedFormGroup.patchValue({ studentToCourseId: '' });
    this.AdvancedFeesReceivedFormGroup.patchValue({ comment: '' });
    this.AdvancedFeesReceivedFormGroup.patchValue({ amount: 0 });
    let registerId = 0;
    this.courseNameList = [];
    let studentId = this.AdvancedFeesReceivedFormGroup.get('studentId')?.value;
    //this.courseNameList = [];
    this.tempGetActiveCourseObj = {
      ledger_id: studentId,
      organisationId: this.organisationId
    };
    this.transactionServicesService.fetchAllStudentToCourses(this.tempGetActiveCourseObj).subscribe(response => {
      this.courseNameList = response.data;
      console.log("courseNameList:", this.courseNameList);
      })
  }
  onClickedAdvancedVoucher($data:any){
    console.log("all data:",$data);
    this.advComments='';
    this.advTranDate='';
    this.advComments=$data.comment;
    this.advTranDate=$data.transaction_date;
     this.totalRecepitAdvAmount = 0;
    this.rupeeInWords = '';
    this.AdvshowReceiptBoolean = true; 
    this.selectedIndex = 4;
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
    /* console.log("id:", fees.student_course_registration_id);
    this.tempGetActiveCourseObj = {};
    this.tempGetActiveCourseObj = {
      id: fees.student_course_registration_id,
      organisationId: this.organisationId
    }; */
   
    this.transactionServicesService.fetchAllAdvancedReceivedHistoryById($data.student_course_registration_id).subscribe(response => {
      this.allAdvancedReceivedHistoryByIdArray = response.data;
      console.log("fetchAllAdvancedReceivedHistoryById:", this.allAdvancedReceivedHistoryByIdArray);
      this.billing_name = this.allAdvancedReceivedHistoryByIdArray[0].billing_name;
      this.whatsapp_number = this.allAdvancedReceivedHistoryByIdArray[0].whatsapp_number;
      this.full_name = this.allAdvancedReceivedHistoryByIdArray[0].full_name;
      this.total_advanced = this.allAdvancedReceivedHistoryByIdArray[0].total_advanced;
      this.received_advanced = this.allAdvancedReceivedHistoryByIdArray[0].received_advanced;
      this.advanced_due = this.allAdvancedReceivedHistoryByIdArray[0].advanced_due;
      this.transaction_date = this.allAdvancedReceivedHistoryByIdArray[0].transaction_date;
      this.transaction_number = this.allAdvancedReceivedHistoryByIdArray[0].transaction_number;
      this.total_discount = this.allAdvancedReceivedHistoryByIdArray[0].total_discount;
      console.log("Array:", this.allAdvancedReceivedHistoryByIdArray);
      for (let val of this.allAdvancedReceivedHistoryByIdArray) {
        this.totalRecepitAdvAmount = Number(this.totalRecepitAdvAmount) + Number(val.amount);
      }
      this.rupeeInWords = toWords.convert(this.totalRecepitAdvAmount); 
      })
  }
  onUpdate(){
    this.transactionDate='';
    this.ledgerId = this.AdvancedFeesReceivedFormGroup.get('ledgerId')?.value;
    this.amount = this.AdvancedFeesReceivedFormGroup.get('amount')?.value;
    this.transactionDate = this.AdvancedFeesReceivedFormGroup.get('transactionDate')?.value;
    this.studentCourseRegistrationId = this.AdvancedFeesReceivedFormGroup.get('studentToCourseId')?.value;
    this.comment = this.AdvancedreceivedComments;
    var DateObj = new Date(this.transactionDate);
    this.transactionMonth = DateObj.getMonth() + 1;
    this.transactionYear = DateObj.getFullYear();
    console.log("Month No:", DateObj.getMonth() + 1);
    console.log("Year No:", DateObj.getFullYear());
    if (this.ledgerId === 1) {
      this.mode = 'Cash'
    } else {
      this.mode = 'Bank'
    }
    this.transactionDate = formatDate(this.transactionDate, 'yyyy-MM-dd', 'en');
    Swal.fire({
      title: 'Are you sure Update?',
      html: '<pre> Date:' + this.transactionDate + '</pre>' + '<br><pre> Amount:' + this.amount + '</pre>' + '<br><pre>Payment Mode:' + this.mode + '</pre>',
      text: ' Save This Record...?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tempReceicedObj = {
          transactionMaster: {
            studentCourseRegistrationId: this.studentCourseRegistrationId,
            transactionDate: this.transactionDate,
            comment: this.comment,
            feesYear: this.transactionYear,
            feesMonth: this.transactionMonth,
            organisationId: this.organisationId
          },
          transactionDetails: [
            {
              ledgerId: this.ledgerId,
              transactionTypeId: 1,
              amount: this.amount
            },
            {
              ledgerId: 77,
              transactionTypeId: 2,
              amount: this.amount
            }
          ]
        }
        this.transactionServicesService.updateAdvancedFeesReceived(this.advReceivedTransactionId,this.tempReceicedObj).subscribe(response => {
          //this.showError = response.exception;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Advanced has been Updated',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllAdvReceived(this.organisationId);
            this.getAdvStudentName(this.organisationId);
            this.getAllAdvancedReceivedHistory(this.organisationId);
            this.getAllAdvReceivedAdjustment(this.organisationId);
            this.clearFeesReceivedAdv();
           
          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Course Code..!!',
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
  onEditAdvancedReceived($data:any){
    this.selectedIndex = 1;
    console.log("all data:",$data);
    this.advCourseNameBoolean=true;
    this.hiddenTransactionInfo=true;
    //this.advReceivedHiddenInputBoolean=true;
    this.advAmountBoolean=true;
    this.advCommentsBoolean=true;
    this.AdvancedFeesReceivedFormGroup.patchValue({ transactionId: $data.id });
    this.advReceivedTransactionId=$data.id;
    console.log("advReceivedTransactionId :",this.advReceivedTransactionId);
    this.transactionServicesService.fetchEditAdvancedReceived($data.id).subscribe(response => {
      this.editAdvReceivedArray = response.data;
      console.log("editAdvReceivedArray:", this.editAdvReceivedArray);
      this.AdvancedFeesReceivedFormGroup.patchValue({ studentId: this.editAdvReceivedArray[0].id });
      this.AdvancedFeesReceivedFormGroup.patchValue({ studentToCourseId: this.editAdvReceivedArray[0].student_course_registration_id });
      this.AdvancedFeesReceivedFormGroup.patchValue({ amount: this.editAdvReceivedArray[0].amount });
      this.AdvancedFeesReceivedFormGroup.patchValue({ transactionDate: this.editAdvReceivedArray[0].transaction_date });
      this.AdvancedFeesReceivedFormGroup.patchValue({ ledgerId: this.editAdvReceivedArray[0].ledger_id });

      this.tempGetActiveCourseObj = {
        ledger_id: this.editAdvReceivedArray[0].id,
        organisationId: this.organisationId
      };
      this.transactionServicesService.fetchAllStudentToCourses(this.tempGetActiveCourseObj).subscribe(response => {
        this.courseNameList = response.data;
        console.log("courseNameList:", this.courseNameList);
        })
       
    })

    this.transactionServicesService.fetchAdvancedDetails($data.student_course_registration_id).subscribe(response => {
      this.advancedDetailsArray = response.data;
      console.log("advancedDetailsArray:", this.advancedDetailsArray);
      this.totalAdvanced = this.advancedDetailsArray[0].total_advanced;
      this.receivedAdvanced = this.advancedDetailsArray[0].received_advanced;
      this.advancedDue = this.advancedDetailsArray[0].advanced_due;
    })
   
     
  }
  onClickedClosed() {
    this.selectedIndex = 0;
  }
  adjustmentChangeCourseId() {
    this.hiddenEachTranDetails=false;
    this.courseNameBoolean = true;
    this.transactionNoBoolean = false;
    this.studentNameBoolean = true;
    this.tempReceiceAdjustmentdObj = {};
    this.tranMasterIdArray = [];
    this.tempGetActiveCourseObj={};
    //this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ adjustmentStudentId: '' });
    this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ adjustmentStudentToCourseId: '' });
    this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ transactionMasterId: '' });

    let registerId = 0;
    this.courseNameList = [];
    this.adjustmentStudentId = this.AdvancedAdjustmentFeesReceivedFormGroup.get('adjustmentStudentId')?.value;
    
    //this.courseNameList = [];
    this.tempGetActiveCourseObj = {
      ledger_id: this.adjustmentStudentId,
      organisationId: this.organisationId
    };
    this.transactionServicesService.fetchAllStudentToCourses(this.tempGetActiveCourseObj).subscribe(response => {
      this.courseNameList = response.data;
      console.log("AdjustmentcourseNameList:", this.courseNameList);
    })
  }
  getAdvStudentName($orgID: any) {
    this.transactionServicesService.fetchAllAdvStudentName($orgID).subscribe(response => {
      this.studentNameList = response.data;
      console.log("studentNameList:", this.studentNameList);
    })
  }
  getAllAdvReceived($orgID: any) {
    this.transactionServicesService.fetchAllAdvancedReceivedDetails($orgID).subscribe(response => {
      this.allAdvancedDetailsArray = response.data;
      console.log("allAdvancedDetailsArray:", this.allAdvancedDetailsArray);
    })
  }
  getAllAdvReceivedAdjustment($orgID: any) {
    this.transactionServicesService.fetchAllAdvFeesReceivedAdjustment($orgID).subscribe(response => {
      this.allAdvReceivedAdjustmentArray = response.data;
      console.log("allAdvReceivedAdjustmentArray:", this.allAdvReceivedAdjustmentArray);
    })
  }
  getAllAdvancedReceivedHistory($orgID: any) {
    this.transactionServicesService.fetchAllAdvancedReceivedHistory($orgID).subscribe(response => {
      this.allAdvancedReceivedHistoryArray = response.data;
      console.log("allAdvancedReceivedHistoryArray:", this.allAdvancedReceivedHistoryArray);
    })
  }
  
  getAllAdvancedReceivedHistoryById($id: any) {
    this.transactionServicesService.fetchAllAdvancedReceivedHistory($id).subscribe(response => {
      this.allAdvancedReceivedHistoryByIdArray = response.data;
      console.log("allAdvancedReceivedHistoryByIdArray:", this.allAdvancedReceivedHistoryByIdArray);
    })
  }
  deleteAdvFeesReceivedAdj($data:any){
    console.log("data:",$data)
   Swal.fire({
      title: 'Are you sure?',
      text: 'Delete All Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.transactionServicesService.deleteAdvAdjustmentFeesReceived($data.id).subscribe(response => {
            if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Adv. Fees has been Delete',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllAdvReceivedAdjustment(this.organisationId);
           
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
  onSaveAdjustment() {
    this.transactionDate='';
    this.ledgerId = this.AdvancedAdjustmentFeesReceivedFormGroup.get('ledgerId')?.value;
    this.amount = this.totalCurrentDue;
    this.transactionDate = this.AdvancedAdjustmentFeesReceivedFormGroup.get('adjuestmenTtransactionDate')?.value;
    this.referenceReceivedTransactionMasterId = this.AdvancedAdjustmentFeesReceivedFormGroup.get('referenceReceivedTransactionMasterId')?.value;
    this.transactionMasterId=this.AdvancedAdjustmentFeesReceivedFormGroup.get('transactionMasterId')?.value;
    this.comment = 'Advanced Adjustment Entry';
    var DateObj = new Date(this.transactionDate);
    this.transactionMonth = DateObj.getMonth() + 1;
    this.transactionYear = DateObj.getFullYear();
    console.log("Month No:", DateObj.getMonth() + 1);
    console.log("Year No:", DateObj.getFullYear());
    if (this.ledgerId === 1) {
      this.mode = 'Cash'
    } else {
      this.mode = 'Bank'
    }
    let tranDate = formatDate(this.transactionDate, 'yyyy-MM-dd', 'en');
   
   Swal.fire({
      title: 'Are you sure?',
      html: '<pre> Date:' + this.transactionDate + '</pre>' + '<br><pre> Amount:' + this.amount + '</pre>' ,
      text: ' Save This Record...?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tempReceiceAdjustmentdObj = {
          transactionMaster: {
            userId:1,
            referenceTransactionMasterId: this.transactionMasterId,
            referenceReceivedTransactionMasterId:this.referenceReceivedTransactionMasterId,
            studentCourseRegistrationId: this.studentCourseRegistrationId,
            transactionDate: tranDate,
            comment: this.comment,
            feesYear: this.transactionYear,
            feesMonth: this.transactionMonth,
            organisationId: this.organisationId
          },
          transactionDetails: [
            {
              ledgerId: 40,
              transactionTypeId: 1,
              amount: this.amount
            },
            {
              ledgerId: this.adjustmentStudentId,
              transactionTypeId: 2,
              amount: this.amount
            }
          ]
        }
        this.transactionServicesService.saveAadvancedFeesReceivedAdjustment(this.tempReceiceAdjustmentdObj).subscribe(response => {
          //this.showError = response.exception;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Advanced has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllAdvReceived(this.organisationId);
            this.getAdvStudentName(this.organisationId);
            this.getAllAdvancedReceivedHistory(this.organisationId);
            this.getAllAdvReceivedAdjustment(this.organisationId);
            this.clearAdjustmentFeesReceivedAdv();

          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Course Code..!!',
            text: error,
            footer: '<a href>Why do I have this issue?</a>' ,
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
    this.transactionDate='';
    this.ledgerId = this.AdvancedFeesReceivedFormGroup.get('ledgerId')?.value;
    this.amount = this.AdvancedFeesReceivedFormGroup.get('amount')?.value;
    this.transactionDate = this.AdvancedFeesReceivedFormGroup.get('transactionDate')?.value;
    this.studentCourseRegistrationId = this.AdvancedFeesReceivedFormGroup.get('studentToCourseId')?.value;
    this.comment = this.AdvancedreceivedComments;
    var DateObj = new Date(this.transactionDate);
    this.transactionMonth = DateObj.getMonth() + 1;
    this.transactionYear = DateObj.getFullYear();
    console.log("Month No:", DateObj.getMonth() + 1);
    console.log("Year No:", DateObj.getFullYear());
    if (this.ledgerId === 1) {
      this.mode = 'Cash'
    } else {
      this.mode = 'Bank'
    }
    this.transactionDate = formatDate(this.transactionDate, 'yyyy-MM-dd', 'en');
    Swal.fire({
      title: 'Are you sure?',
      html: '<pre> Date:' + this.transactionDate + '</pre>' + '<br><pre> Amount:' + this.amount + '</pre>' + '<br><pre>Payment Mode:' + this.mode + '</pre>',
      text: ' Save This Record...?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tempReceicedObj = {
          transactionMaster: {
            studentCourseRegistrationId: this.studentCourseRegistrationId,
            transactionDate: this.transactionDate,
            comment: this.comment,
            feesYear: this.transactionYear,
            feesMonth: this.transactionMonth,
            organisationId: this.organisationId
          },
          transactionDetails: [
            {
              ledgerId: this.ledgerId,
              transactionTypeId: 1,
              amount: this.amount
            },
            {
              ledgerId: 40,
              transactionTypeId: 2,
              amount: this.amount
            }
          ]
        }
        this.transactionServicesService.saveAadvancedFeesReceived(this.tempReceicedObj).subscribe(response => {
          //this.showError = response.exception;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Advanced has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllAdvReceived(this.organisationId);
            this.getAdvStudentName(this.organisationId);
            this.getAllAdvancedReceivedHistory(this.organisationId);
            this.getAllAdvReceivedAdjustment(this.organisationId);
            this.clearFeesReceivedAdv();
          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Course Code..!!',
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
  clearFeesReceivedAdv() {

    this.advAmountBoolean = false;
    this.transactionNoBoolean = false;
    this.advCommentsBoolean=false;
    this.advCourseNameBoolean = false; 
    this.hiddenTransactionInfo=false;

    this.hiddenEachTranDetails=false;
    this.courseNameBoolean = false;
    this.transactionNoBoolean = false;
    this.studentNameBoolean = false;
    this.tempReceiceAdjustmentdObj = {};
    this.tranMasterIdArray = [];
    this.tempGetActiveCourseObj={};
    //this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ adjustmentStudentId: '' });
    this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ adjustmentStudentToCourseId: '' });
    this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ transactionMasterId: '' });
    this.hiddenTransactionInfo = false;
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.AdvancedFeesReceivedFormGroup = new FormGroup({
      studentId: new FormControl(null, [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
      transactionDate: new FormControl(val),
      studentToCourseId: new FormControl(null, [Validators.required]),
      ledgerId: new FormControl(1, [Validators.required]),
      /*transactionId: new FormControl(0, [Validators.required]), */

    })
  }
  clearAdjustmentFeesReceivedAdv(){
    this.hiddenTransactionInfo = false;
    this.hiddenEachTranDetails = false;
    this.hiddenAdvReceived=false;
    this.courseNameBoolean = false;
    this.transactionNoBoolean = false;
    this.studentNameBoolean = false;
    this.tempGetActiveCourseObj = {};
    this.tranMasterIdArray = [];
    this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ adjustmentStudentId: '' });
    this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ adjustmentStudentToCourseId: '' });
    this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ transactionMasterId: '' });
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.AdvancedAdjustmentFeesReceivedFormGroup = new FormGroup({
      adjuestmenTtransactionDate: new FormControl(val, [Validators.required]),
      referenceReceivedTransactionMasterId: new FormControl(null, [Validators.required]),
      adjustmentStudentId: new FormControl(null, [Validators.required]),
      adjustmentStudentToCourseId: new FormControl(null, [Validators.required]),
      transactionMasterId: new FormControl(null, [Validators.required]),
    })
  }
  getRegisterId(id: any) {
    console.log("all data:",id);
    this.totalAdvanced = 0;
    this.receivedAdvanced = 0;
    this.advancedDue = 0;
    this.advancedDetailsArray=[];
    this.hiddenTransactionInfo = true;
    this.advAmountBoolean=true;
    this.advCommentsBoolean=true;
    this.AdvancedreceivedComments = 'Received Advanced Fees: For the Month of Feb to Apr 2023';
    this.studentToCourseRegisterId = id.id;
    console.log("studentToCourseRegisterId:", this.studentToCourseRegisterId);
    this.transactionServicesService.fetchAdvancedDetails(this.studentToCourseRegisterId).subscribe(response => {
      this.advancedDetailsArray = response.data;
      console.log("advancedDetailsArray:", this.advancedDetailsArray);
      this.totalAdvanced = this.advancedDetailsArray[0].total_advanced;
      this.receivedAdvanced = this.advancedDetailsArray[0].received_advanced;
      this.advancedDue = this.advancedDetailsArray[0].advanced_due;
    })
  }
  getActiveAdvReceived(data: any) {
    this.hiddenEachTranDetails=false;
    this.courseNameBoolean = false;
    this.transactionNoBoolean = false;
    this.studentNameBoolean = true;
    this.tempGetActiveCourseObj = {};
    this.tranMasterIdArray = [];
    this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ adjustmentStudentId: '' });
    this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ adjustmentStudentToCourseId: '' });
    this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ transactionMasterId: '' });

    
    this.transactionDateAdv = '';
    this.fullName = '';
    this.studentCourseRegistrationId='';
    this.amount = 0;
    this.hiddenAdvReceived = true;
    this.advancedDue = 0;
    this.receivedAdvanced = 0;
    this.transactionDateAdv = data.transaction_date;
    this.fullName = data.full_name;
    this.comment = data.comment;
    this.amount = data.amount;
    this.advancedDue = data.adv_due;
    this.receivedAdvanced = data.advanced_received;
    console.log("advancedDetailsArray:", data.student_course_registration_id);
    this.studentCourseRegistrationId=data.student_course_registration_id;
  }

  getEachAdjustmentTranMasterDetails(data: any) {
    this.hiddenEachTranDetails = true;
    console.log("tran history:", data);
    this.totalCurrentDue = 0;
    this.courseName = data.ledger_name;
    this.totalCurrentDue = data.total_due;
  }
  getAdjustmentTranMasterId() {
  
    this.AdvancedAdjustmentFeesReceivedFormGroup.patchValue({ transactionMasterId: '' });
    this.tranMasterIdArray=[];
    this.transactionNoBoolean = true;
    this.receivedGrandTotal = 0;
    this.totalCourseDue = 0;
    this.totalCurrentDue = 0;
    this.feesReceivedDetailsArray = [];
    this.tranMasterIdArray = [];
    this.tempGetActiveCourseObj = {};
    this.hiddenEachTranDetails = false;
    //this.FeesReceivedFormGroup.patchValue({ transactionMasterId: '' });
    this.adjustmentStudentCourseRegistrationId = this.AdvancedAdjustmentFeesReceivedFormGroup.get('adjustmentStudentToCourseId')?.value;
    console.log("adjustmentStudentCourseRegistrationId:", this.adjustmentStudentCourseRegistrationId);
    this.tempGetActiveCourseObj = {
      id: this.adjustmentStudentCourseRegistrationId,
      organisationId: this.organisationId
    };
    this.transactionServicesService.fetchAllTranMasterId(this.tempGetActiveCourseObj).subscribe(response => {
      this.tranMasterIdArray = response.data;
      console.log("AdjustmenttranMasterIdArray:", this.tranMasterIdArray);
    })

   
  }
}

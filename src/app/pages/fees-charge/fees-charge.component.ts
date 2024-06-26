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
  selector: 'app-fees-charge',
  templateUrl: './fees-charge.component.html',
  styleUrls: ['./fees-charge.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class FeesChargeComponent implements OnInit {
  UserID: number = 0;
  organisationId: number = 0;
  isDeviceXS = false;
  checked = false;
  isSave = false;
  tr_date: Date = new Date();
  studentId: any;
  transactionDate: any;
  transactionMonth: any;
  transactionYear: any;
  totalFees: number = 0;
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
  isCashReceived: boolean = false;
  referenceTransactionMasterId: number = 0;
  studentsCharge: any[] = [];
  monthlyStudentArray: any[] = [];
  studentToCourseId: any;
  studentNameList: any[] = [];
  FeesChargeFormGroup: FormGroup | any;
  BankReceivedFormGroup: FormGroup | any;
  feesNameList: any[] = [];
  CourseId: any;
  courseNameList: any = [];
  transactionList: any = [];
  tempFeesArray: any = [];
  feesReceivedArray: any = [];
  feesChargeDetailsArray: any = [];
  tempItemObj!: object;
  tempGetActiveCourseObj!: object;

  tempSaveItemObj!: object;
  tempObj!: object;
  tempChargeObj!: object;
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
      this.studentNameList = response.feesChargeResolver.studentsCharge.data;
      this.feesNameList = response.feesChargeResolver.feesNames.data;
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
  //const now = new Date();
  //val = formatDate(now, 'yyyy-MM-dd', 'en');
  feesChargedTransactionDate: string = '';
  ngOnInit(): void {

    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.feesChargedTransactionDate = val;
    //this.date=new Date();
    //transactionDate :this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.FeesChargeFormGroup = new FormGroup({

      studentId: new FormControl(null, [Validators.required]),
      transactionId: new FormControl(0, [Validators.required]),
      comment: new FormControl(),
      amount: new FormControl(null, [Validators.required]),
      transactionDate: new FormControl(),
      studentToCourseId: new FormControl(null, [Validators.required]),
      ledgerId: new FormControl(7, [Validators.required]),
    })

    this.BankReceivedFormGroup = new FormGroup({
      accountNo: new FormControl(null, [Validators.required]),
      ifscNo: new FormControl(null, [Validators.required]),
      branch: new FormControl(null, [Validators.required])
    })

    this.transactionServicesService.fetchAllFeesName().subscribe(response => {
      this.feesNameList = response.data;
    })
    this.transactionServicesService.fetchAllStudentName(this.organisationId).subscribe(response => {
      this.studentNameList = response.data;
    })
    this.getAllReceivedFees(this.organisationId);
    this.getAllMonthlyStudent(this.organisationId);
  }
  receivedAmount: number = 0;
  //dateObj:any;

  selectedIndex = 0;
  /*  changeFeesDate(){
     this.transactionDate=this.feesChargedTransactionDate;
     console.log("tr date:", this.transactionDate)
   } */
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
  getAllReceivedFees($orgID: any) {
    this.transactionServicesService.fetchAllFeesCharged($orgID).subscribe(response => {
      this.feesReceivedArray = response.data;
    })
  }
  getAllMonthlyStudent($orgID: any) {
    this.transactionServicesService.fetchMonthlyStudentList($orgID).subscribe(response => {
      this.monthlyStudentArray = response.data;
      console.log("Monthly Student:", this.monthlyStudentArray);
    })
  }
  clear(table: Table) {
    table.clear();
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  getEachMonthly(data: any) {
    console.log("data:", data);

    Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tempItemObj = {
          transactionMaster: {
            userId: 1,
            studentCourseRegistrationId: data.student_course_registration_id,
            transactionDate: data.transaction_date,
            organisationId: this.organisationId,
            comment: "Auto Monthly Fees"

          },
          transactionDetails: [
            {
              ledgerId: 9,
              transactionTypeId: 2,
              amount: data.amount
            },
            {
              ledgerId: data.student_id,
              transactionTypeId: 1,
              amount: data.amount
            }
          ]
        }
        this.transactionServicesService.monthlyFeesCharge(this.tempItemObj).subscribe(response => {
          if (response.success === 1) {
            this.getAllMonthlyStudent(this.organisationId);
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Fees Charged has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.isCashReceived = true;
            this.getAllReceivedFees(this.organisationId);
            this.tempFeesArray = [];
            this.totalAmount = 0;
            this.clearFeesReceived();
            this.FeesChargeFormGroup.reset();
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
    /*  this.confirmationService.confirm({
       message: 'Do you want to Save this record?',
       header: 'Delete Confirmation',
       icon: 'pi pi-info-circle',
       accept: () => {
         this.tempItemObj = {
           transactionMaster: {
             userId: 1,
             studentCourseRegistrationId: data.student_course_registration_id,
             transactionDate: data.transaction_date,
             organisationId: this.organisationId,
             comment: "Auto Monthly Fees"
 
           },
           transactionDetails: [
             {
               ledgerId: 9,
               transactionTypeId: 2,
               amount: data.amount
             },
             {
               ledgerId: data.student_id,
               transactionTypeId: 1,
               amount: data.amount
             }
           ]
         }
         this.transactionServicesService.monthlyFeesCharge(this.tempItemObj).subscribe(response => {
           if (response.success === 1) {
             this.getAllMonthlyStudent(this.organisationId);
 
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
     }); */
  }
  saveAllStudentMonthly() {
   Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.transactionServicesService.allStudentMonthlyFeesCharge(this.organisationId).subscribe(response => {
          if (response.success === 1) {
            this.getAllMonthlyStudent(this.organisationId);
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'All Fees Charged has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllReceivedFees(this.organisationId);
            this.tempFeesArray = [];
            this.totalAmount = 0;
            this.clearFeesReceived();
            this.FeesChargeFormGroup.reset();
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
  onAddFees() {

    this.ledgerId = this.FeesChargeFormGroup.get('ledgerId')?.value;
    this.amount = this.FeesChargeFormGroup.get('amount')?.value;
    this.totalAmount = Number(this.totalAmount) + Number(this.amount);
    const tempItem = this.FeesChargeFormGroup.value;
    let index = this.feesNameList.findIndex((x: { id: any; }) => x.id === tempItem.ledgerId);
    this.tempItemObj = {
      ledgerId: this.ledgerId,
      transactionTypeId: 2,
      feesName: this.feesNameList[index].ledger_name,
      amount: this.amount
    }
    this.tempFeesArray.push(this.tempItemObj);
    this.tempTotalAmount = this.totalAmount;
    this.isSave = true;
    this.FeesChargeFormGroup = new FormGroup({
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
  clearFeesReceived() {
    this.isShown = false;
    this.hiddenPopup = false;
    this.tempGetActiveCourseObj = {};
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.FeesChargeFormGroup = new FormGroup({
      transactionId: new FormControl(0, [Validators.required]),
      studentId: new FormControl(null, [Validators.required]),
      comment: new FormControl(),
      amount: new FormControl(null, [Validators.required]),
      feesChargedTransactionDate: new FormControl(val),
      studentToCourseId: new FormControl(null, [Validators.required]),
      ledgerId: new FormControl(7, [Validators.required])
    })
    this.BankReceivedFormGroup = new FormGroup({
      accountNo: new FormControl(null, [Validators.required]),
      ifscNo: new FormControl(null, [Validators.required]),
      branch: new FormControl(null, [Validators.required])
    })
    this.isCashReceived = false;
    this.tempFeesArray = [];
    this.totalAmount = 0;
  }
  changeCourseId() {

    this.studentId = this.FeesChargeFormGroup.get('studentId')?.value;

    this.tempGetActiveCourseObj = {};

    this.tempGetActiveCourseObj = {
      ledger_id: this.studentId,
      organisationId: this.organisationId
    };
    this.FeesChargeFormGroup.patchValue({ studentToCourseId: '' });
    //this.FeesChargeFormGroup.patchValue('studentToCourseId').value="";
    this.transactionServicesService.fetchAllStudentToCourses(this.tempGetActiveCourseObj).subscribe(response => {
      this.courseNameList = [];
      this.courseNameList = response.data;
    })
    /*  */
  }

  editFeesReceived(feeDetails: any) {

    this.selectedIndex = 0;
    this.hiddenPopup = false;
    this.event = 0;
    this.onTabChanged(this.event);
    this.isShown = true;
    this.tempFeesArray = [];
    this.totalAmount = 0;
    this.tempGetActiveCourseObj = {};
    this.tempGetActiveCourseObj = {
      organisationId: this.organisationId,
      id: feeDetails.id
    };
    this.transactionServicesService.fetchAllTransaction(this.tempGetActiveCourseObj).subscribe(response => {
      this.transactionList = response.data;
      this.tempGetActiveCourseObj = {};
      this.tempGetActiveCourseObj = {
        organisationId: this.organisationId,
        ledger_id: response.data[0].student_id
      };
      this.transactionServicesService.fetchAllStudentToCourses(this.tempGetActiveCourseObj).subscribe(response => {
        this.courseNameList = response.data;
      })
      /*   this.FeesChargeFormGroup.patchValue({transactionId: response.data[0].id});
        this.FeesChargeFormGroup.patchValue({studentId: response.data[0].student_id});
        this.FeesChargeFormGroup.patchValue({studentToCourseId: response.data[0].student_course_registration_id});
        this.FeesChargeFormGroup.patchValue({comment: response.data[0].comment});
        this.FeesChargeFormGroup.patchValue({transactionDate: response.data[0].transaction_date}); */
      this.studentId = response.data[0].student_id;
      this.studentToCourseId = response.data[0].student_course_registration_id;
      this.transactionId = response.data[0].id;
      let tr_date = response.data[0].transaction_date;
      this.transactionDate = formatDate(tr_date, 'yyyy-MM-dd', 'en');
      this.comment = response.data[0].comment;
      this.FeesChargeFormGroup = new FormGroup({
        transactionId: new FormControl(response.data[0].id),
        studentId: new FormControl(response.data[0].student_id),
        comment: new FormControl(response.data[0].comment),
        amount: new FormControl(0),
        studentToCourseId: new FormControl(response.data[0].student_course_registration_id),
        ledgerId: new FormControl(7, [Validators.required]),
        transactionDate: new FormControl(this.transactionDate)
      })
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
    var DateObj = new Date(this.transactionDate);
    this.transactionMonth = DateObj.getMonth() + 1;
    this.transactionYear = DateObj.getFullYear();
    this.hiddenPopup = false;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Update This Record...?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.transactionDate = formatDate(this.feesChargedTransactionDate, 'yyyy-MM-dd', 'en');

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
            feesYear: this.transactionYear,
            feesMonth: this.transactionMonth
          },
          transactionDetails: Object.values(this.tempFeesArray)
        }
        this.transactionServicesService.updateFeesCharge(this.transactionId, this.tempObj).subscribe(response => {
          this.referenceTransactionMasterId = response.data.transactionMasterId;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Fees Chared has been Updated',
              showConfirmButton: false,
              timer: 1500
            });
            this.isCashReceived = true;
            this.getAllReceivedFees(this.organisationId);
            this.tempFeesArray = [];
            this.totalAmount = 0;
            this.clearFeesReceived();
            this.FeesChargeFormGroup.reset();
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

  getActiveCourse() {
    this.hiddenPopup = true;
    this.totalFees = 0;
    let studentId = this.FeesChargeFormGroup.get('studentId')?.value;
    this.studentToCourseId = this.FeesChargeFormGroup.get('studentToCourseId')?.value;


    console.log("studentId:", studentId);
    console.log("studentToCourseId:", this.studentToCourseId);
    this.tempGetActiveCourseObj = {};
    this.tempGetActiveCourseObj = {
      id: this.studentToCourseId,
      organisationId: this.organisationId
    };

    this.transactionServicesService.fetchFeesChargeDetailsById(this.tempGetActiveCourseObj).subscribe(response => {
      this.feesChargeDetailsArray = response.data;
      for (let val of this.feesChargeDetailsArray) {
        this.totalFees += val.amount;
      }
    })
    this.tempGetActiveCourseObj = {};
    this.tempGetActiveCourseObj = {
      studentToCourseId: this.studentToCourseId,
      organisationId: this.organisationId
    };
    //this.transactionServicesService.fetchCourseId(this.studentToCourseId).subscribe(response=>{
    this.transactionServicesService.fetchCourseId(this.tempGetActiveCourseObj).subscribe(response => {
      this.getCourseIdArray = response.data;
      this.CourseId = response.data[0].course_id;
      //end code
      this.tempGetActiveCourseObj = {};

      this.tempGetActiveCourseObj = {
        ledger_id: studentId,
        course_id: this.CourseId,
        organisationId: this.organisationId
      };
      this.transactionServicesService.fetchAllActiveCourse(this.tempGetActiveCourseObj).subscribe(response => {
        this.popUpRestultArray = response.data;
        //end code

      })

    })


  }


  onSave() {
    //this.transactionDate=this.FeesChargeFormGroup.get('transactionDate')?.value;
    var DateObj = new Date(this.feesChargedTransactionDate);
    this.transactionMonth = DateObj.getMonth() + 1;
    this.transactionYear = DateObj.getFullYear();
    console.log("Month No:", DateObj.getMonth() + 1);
    console.log("Year No:", DateObj.getFullYear());
    let comment = this.FeesChargeFormGroup.get('comment')?.value;
    console.log("studentId:", this.studentId);
    console.log("comment:", comment);

    Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.transactionDate = formatDate(this.feesChargedTransactionDate, 'yyyy-MM-dd', 'en');
        console.log("transactionDate:", this.transactionDate);
        console.log("studentToCourseId:", this.studentToCourseId);
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
            feesYear: this.transactionYear,
            feesMonth: this.transactionMonth,
            organisationId: this.organisationId
          },
          transactionDetails: Object.values(this.tempFeesArray)
        }
        this.transactionServicesService.feesCharge(this.tempObj).subscribe(response => {
          this.referenceTransactionMasterId = response.data.transactionMasterId;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Fees Charged has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.isSave = false;
            this.getAllReceivedFees(this.organisationId);
            this.getAllMonthlyStudent(this.organisationId);
            this.tempFeesArray = [];
            this.totalAmount = 0;
            this.clearFeesReceived();
            this.FeesChargeFormGroup.reset();
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

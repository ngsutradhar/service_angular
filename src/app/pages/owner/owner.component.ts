import { Component, OnInit } from '@angular/core';
import { BijoyaRegistration } from 'src/app/models/bijoya-regitration.model';
import { BijoyaRegistrationService } from 'src/app/services/bijoya-registration.service';
import { CommonService } from 'src/app/services/common.service';
import { LitElement, html } from 'lit-element';
import 'fa-icons';
import { ReportService } from 'src/app/services/report.service';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { CourseService } from 'src/app/services/course.service';
import { StudentToCourseService } from 'src/app/services/student-to-course.service';
import { Table } from 'primeng/table/table';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
import { ToWords } from 'to-words';
import Swal from 'sweetalert2';
import { StudentService } from 'src/app/services/student.service';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentToCourse } from 'src/app/models/studenttocourse.model';
import { Student } from 'src/app/models/student.model';

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
export interface section{
  id:string;
  sec:string;
}
@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
  organisationId: number = 0;
  UserID: number = 0;
  organisationName: string = '';
  organisationAddress: string = '';
  organisationPin: string = '';
  organisationContact: string = '';
  organisationEmail: string = '';
  organizationArray: any = [];
  monthlyStudentArray: any = [];
  itemValue!: object;
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

  studentTocourseData: {
    id?: number;
    reference_number?: number;
    studentId?: number;
    courseId?: number;
    baseFee?: number;
    discountAllowed?: number;
    joiningDate?: string;
    effectiveDate?: string;
    actual_course_duration?: number;
    duration_type_id?: number;
    isStarted?: number;
    organisationId?: number;


    ledger_id?: number;
    course_id?: number;
    base_fee?: number;
    discount_allowed?: number;
    joining_date?: string;
    is_started?: number;
    effective_date?: string;
  } = {};

  studentToCourseFormGroup: FormGroup | any;
  tempGetActiveCourseObj!: object;
  allIncomeArray: any = [];
  allBillReceiptArray: any = [];
  AllInactiveStudentArray: any[] = [];
  showReceipt: boolean = false;
  selectedIndex: number = 0;
  rupeeInWords: string = '';
  totalRecepitAmount: number = 0;
  birthdayArray: any = [];
  upcomingDueListArray: any = [];
  studentRegistrationHistoryArray: any = [];
  pivotTableAdmissionArray: any[] = [];
  pivotTableIncomeArray: any[] = [];
  workingEndDate: any;
  workingDescription: string = '';
  dateDifference: number = 0;
  totalNoCourse: number = 0;
  totalNoActiveStudent: number = 0;
  totalMonthlyCash: number = 0;
  totalMonthlyBank: number = 0;
  totalYearlyBank: number = 0;
  totalYearlyCash: number = 0;
  totalMonthlyIncome: number = 0;
  totalYearlyIncome: number = 0;
  registratedData: BijoyaRegistration[] = [];
  showMessage: boolean = false;
  showCourseDetails:boolean=false;
  isDeviceXS = false;
  studentArray: any[] = [];
  courses: any[] = [];
  durationTypes: any[] = [];
  feeModeTypeArray: any[] = [];
  courseDetailsArray: any[] = [];
  studentToCourseArray: any[] = [];
  studentTocourses: StudentToCourse[] = [];
  success: number = 0;
  hiddenInput:boolean=false;
  feesAmount:number=0;
  fees_mode_type_name:any;
  course_code:any;
  short_name:any;
  course_duration:any;
  duration_name:any;
  description:any;
  effective_Date: any;
  courseFees:number=0;
  feeModeTypeId: number = 0;
  globelLedgerId: number = 8;
  tempItemValueObj!: object;
  
  title = 'ng2-charts-demo';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;

  constructor(private reportService: ReportService
    , private commonService: CommonService
    , private courseService: CourseService
    , private studentToCourseService: StudentToCourseService
    , private studentService: StudentService
    , private transactionServicesService: TransactionServicesService
    , private activatedRoute: ActivatedRoute

  ) {
    this.activatedRoute.data.subscribe((response: any) => {
      console.log(response);
      //this.students = response.studentCourseRegistrationResolverData.students.data;
      this.durationTypes = response.studentCourseRegistrationResolverData.durationTypes.data;
      this.courses = response.studentCourseRegistrationResolverData.courses.data;
      this.studentTocourses = response.studentCourseRegistrationResolverData.studentTocourses.data;
      console.log("studentToCourse:", this.studentTocourses);
    });
    this.isDeviceXS = commonService.getDeviceXs();
    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }
    this.getAllIncome(this.organisationId);
    this.getTotalCourse(this.organisationId);
    this.getTotalActiveStudent(this.organisationId);
    //this.getWorkingDays();
    this.getStudentBirthDay(this.organisationId);
    this.getStudentUpcomingDueList(this.organisationId);
    this.getStudentToCourseRegistrationList(this.organisationId);
    this.getAllMonthlyStudent(this.organisationId);
    this.getPivotTableAdmissioin(this.organisationId);
    this.getPivotTableIncomeReport(this.organisationId);
    this.getInactiveStudentList(this.organisationId);
    this.getAllCourse(this.organisationId);
    this.getDurationTypes();
    this.getAllStudent(this.organisationId);

  }
  public section :section[] = [
    {id: 'A', sec: 'A'},
    {id: 'B', sec: 'B'},
    {id: 'C', sec: 'C'},
    {id: 'D', sec: 'D'},
    {id: 'E', sec: 'E'},
    {id: 'F', sec: 'F'},
];
  ngOnInit(): void {
    //this.organisationId=1;
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
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.studentToCourseFormGroup = new FormGroup({

      ledger_id: new FormControl(1, [Validators.required]),
      course_id: new FormControl(1, [Validators.required]),
      base_fee: new FormControl(null, [Validators.required]),
      discount_allowed: new FormControl(0, [Validators.required]),
      joining_date: new FormControl(val),
      effective_date: new FormControl(val),
      actual_course_duration: new FormControl(6, [Validators.required]),
      duration_type_id: new FormControl(4, [Validators.required]),
      studentToCourseID: new FormControl(0, [Validators.required]),
      transactionMasterID: new FormControl(0, [Validators.required]),
      section: new FormControl(null),
    })
    
   /*  this.students = this.studentService.getStudents();
    this.studentService.getStudentUpdateListener().subscribe((response: Student[]) => {
      this.students = response;
    }); */
  }
  setEffectiveSQL(value: string) {
    this.studentToCourseFormGroup.patchValue({ effective_date: this.commonService.getSQLDate(value) });
  }
  setJoiningSQL(value: string) {
    this.studentToCourseFormGroup.patchValue({ joining_date: this.commonService.getSQLDate(value) });
  }
  saveStudentToCourse() {
    //alert("Testing");
   /*  this.isCourseDetails=false;
    this.isDashboard=true; */
    Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.effective_Date = this.studentToCourseFormGroup.value.effective_date;
        var DateObj = new Date(this.effective_Date);
        console.log("Month No:", DateObj.getMonth() + 1);
        console.log("Year No:", DateObj.getFullYear());
        this.tempItemValueObj = {
          studentId: this.studentToCourseFormGroup.value.ledger_id,
          courseId: this.studentToCourseFormGroup.value.course_id,
          baseFee: this.studentToCourseFormGroup.value.base_fee,
          discountAllowed: this.studentToCourseFormGroup.value.discount_allowed,
          joiningDate: this.studentToCourseFormGroup.value.joining_date,
          effectiveDate: this.studentToCourseFormGroup.value.effective_date,
          actual_course_duration: this.studentToCourseFormGroup.value.actual_course_duration,
          duration_type_id: this.studentToCourseFormGroup.value.duration_type_id,
          organisationId: this.organisationId,
          isStarted: 1,
          userId: this.UserID,
          feesYear: DateObj.getFullYear(),
          feesMonth: DateObj.getMonth() + 1,
          transactionDetails: [
            {
              transactionTypeId: 2,
              ledgerId: this.globelLedgerId,
              amount: this.studentToCourseFormGroup.value.base_fee
            },
            {
              transactionTypeId: 1,
              ledgerId: this.studentToCourseFormGroup.value.ledger_id,
              amount: this.studentToCourseFormGroup.value.base_fee
            }
          ]
        }

        this.studentToCourseService.saveStudentToCourse(this.tempItemValueObj).subscribe(response => {
          console.log("Save data:", this.studentTocourseData);
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Course Registration has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.clearStudentToCourse();
            this.selectedIndex=2;
            this.showCourseDetails=false;
            this.getTotalActiveStudent(this.organisationId);
            this.getStudentToCourseRegistrationList(this.organisationId);
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
  clearStudentToCourse() {
   /*  this.isCourseDetails=false;
    this.isStudentDetails=false;
    this.isDashboard=true;
    this.isShown = false; */
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.studentToCourseFormGroup = new FormGroup({

      ledger_id: new FormControl(1, [Validators.required]),
      course_id: new FormControl(1, [Validators.required]),
      base_fee: new FormControl(null, [Validators.required]),
      discount_allowed: new FormControl(0, [Validators.required]),
      joining_date: new FormControl(val),
      effective_date: new FormControl(val),
      actual_course_duration: new FormControl(6, [Validators.required]),
      duration_type_id: new FormControl(4, [Validators.required]),
      studentToCourseID: new FormControl(0, [Validators.required]),
      //transactionMasterID: new FormControl(0, [Validators.required])
    })
  }
  isValidForm() {
    if (this.studentToCourseFormGroup.valid) {
      return true;

    } else {
      return false;

    }
  }
  getAllCourse($orgID:any){
    this.courseService.fetchAllCourses(this.organisationId).subscribe(response => {
      this.courses = response.data;
      console.log("courses list:", this.courses);
    })
  }
  getAllStudent($orgID:any){
    this.studentService.fetchAllStudents(this.organisationId).subscribe(response => {
      this.studentArray = response.data;
      console.log("studentArray list:", this.studentArray);
    })
  }
  getDurationTypes(){
    this.courseService.fetchAllDurationType().subscribe(response => {
      this.durationTypes = response.data;
      console.log("durationTypes list:", this.durationTypes);
    })
  }
  changeStudent($event: any) {
   /*  this.isStudentDetails=true;
    this.isCourseDetails=false;
    this.isDashboard=false; */
    //console.log("studentToCourseArray:",$event);
      this.tempGetActiveCourseObj ={};
    this.tempGetActiveCourseObj = {
      id: $event.studentId,
      organisationId: this.organisationId
    };
  this.studentToCourseService.fetchStudentToCourseDetails(this.tempGetActiveCourseObj).subscribe(response => {
      this.studentToCourseArray = response.data;
      console.log("studentToCourseArrayDetails:",this.studentToCourseArray);
      
    })
  }
  changeFeesModeType($event: any) {
    /* this.isCourseDetails=true;
    this.isDashboard=false;*/
    this.showCourseDetails=true; 
    this.feesAmount=0;
    this.tempGetActiveCourseObj = {
      id: $event.id,
      organisationId: this.organisationId
    };
    this.studentToCourseService.fetchCourseDetails(this.tempGetActiveCourseObj).subscribe(response => {
      this.courseDetailsArray = response.data;
      console.log("courseDetailsArray:",this.courseDetailsArray);
     this.fees_mode_type_name=this.courseDetailsArray[0].fees_mode_type_name;
      this.course_code=this.courseDetailsArray[0].course_code;
      this.short_name=this.courseDetailsArray[0].short_name;
      this.course_duration=this.courseDetailsArray[0].course_duration;
      this.duration_name=this.courseDetailsArray[0].duration_name;
      this.description=this.courseDetailsArray[0].description;
      this.courseFees=this.courseDetailsArray[0].fees_amount;
      this.feesAmount=this.courseDetailsArray[0].fees_amount;
      this.feeModeTypeId = this.courseDetailsArray[0].fees_mode_type_id;
      if (this.feeModeTypeId === 1) {
        this.globelLedgerId = 9;
        console.log("globelLedgerId:", this.globelLedgerId);
      } else {
        this.globelLedgerId = 8;
        console.log("globelLedgerId:", this.globelLedgerId);
      }  
    })
  }
  onClickedReceiptVoucher(stuToCourseId: any) {
    this.totalRecepitAmount = 0;
    this.rupeeInWords = '';
    this.showReceipt = true;
    this.selectedIndex = 4;

    this.tempGetActiveCourseObj = {};
    this.tempGetActiveCourseObj = {
      id: stuToCourseId,
      organisationId: this.organisationId
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
  getInactiveStudentList($org: any) {
    this.studentService.fetchAllInactiveStudents($org).subscribe(response => {
      this.AllInactiveStudentArray = response.data;
      console.log("AllInactiveStudentArray:", this.AllInactiveStudentArray);
    })
  }
  onDeleteStudentInforce($studentID: any)
  {
    console.log("studentID:", $studentID);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.deleteStudentInactive($studentID).subscribe(response => {
          this.success = response.success;
          console.log("After Delete Response:",this.success);
          console.log("After Delete Data:",response.data);
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Student Registration has been Deleted',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllStudent(this.organisationId);
            this.getInactiveStudentList(this.organisationId);
            this.selectedIndex = 2;
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
  onUpdateStudentInforce($studentID: any) {
    console.log("studentID:", $studentID);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Update This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.updateStudentInforce($studentID).subscribe(response => {
          this.success = response.success;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'StudentS Registration has been Updated',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllStudent(this.organisationId);
            this.getInactiveStudentList(this.organisationId);
            this.selectedIndex=3;
            this.studentToCourseFormGroup.patchValue({ ledger_id: $studentID });
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
  onClickedClosed() {
    this.selectedIndex = 0;
  }
  active = 0;
  onTabChanged(event: any) {
    console.log(event)
  }
  clear(table: Table) {
    table.clear();
  }
  getEventValue($event: any): string {
    return $event.target.value;
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
  getPivotTableIncomeReport($orgID: any) {
    this.reportService.fetchPivotTableIncomeList($orgID).subscribe(response => {
      this.pivotTableIncomeArray = response.data;
      console.log("pivotTableIncomeArray:", this.pivotTableIncomeArray);
    })
  }
  getPivotTableAdmissioin($orgID: any) {
    this.reportService.fetchPivotTableAdmissionList($orgID).subscribe(response => {
      this.pivotTableAdmissionArray = response.data;
      console.log("pivotTableAdmissionArray:", this.pivotTableAdmissionArray);
    })
  }
  getAllIncome($orgID: any) {
    this.reportService.fetchAllReceiptIncomeReport($orgID).subscribe(response => {
      this.allIncomeArray = response.data;
      this.totalMonthlyCash = this.allIncomeArray[0].total_monthly_cash;
      this.totalMonthlyBank = this.allIncomeArray[0].total_monthly_bank;
      this.totalYearlyBank = this.allIncomeArray[0].total_yearly_bank;
      this.totalYearlyCash = this.allIncomeArray[0].total_yearly_cash;
      this.totalMonthlyIncome = this.allIncomeArray[0].total_monthly_income;
      this.totalYearlyIncome = this.allIncomeArray[0].total_yearly_income;
      console.log("all Income TS:", this.allIncomeArray);
    })
  }
  getAllMonthlyStudent($orgID: any) {
    this.transactionServicesService.fetchMonthlyStudentList($orgID).subscribe(response => {
      this.monthlyStudentArray = response.data;
      console.log("Monthly Student:", this.monthlyStudentArray);
    })
  }
  getTotalCourse($orgID: any) {
    this.courseService.fetchAllTotalCourse($orgID).subscribe(response => {
      this.totalNoCourse = response.data[0].totalCourse;
      console.log("Monthly totalNoCourse:", this.totalNoCourse);
    })
  }
  getTotalActiveStudent($orgID: any) {
    this.studentToCourseService.fetchAllTotalActiveStudent($orgID).subscribe(response => {
      this.totalNoActiveStudent = response.data[0].totalActiveStudent;
      console.log("Monthly totalNoCourse:", this.totalNoActiveStudent);
    })
  }
  getStudentBirthDay($orgID: any) {
    this.reportService.fetchStudentBirthDayDaysReport($orgID).subscribe(response => {
      this.birthdayArray = response.data;
      console.log("birthdayArray:", this.birthdayArray);
    })
  }
  getStudentUpcomingDueList($orgID: any) {
    this.reportService.fetchStudentUpcomingDueListReport($orgID).subscribe(response => {
      this.upcomingDueListArray = response.data;
      console.log("UpcomingDueList:", this.upcomingDueListArray);
    })
  }
  /*  getWorkingDays(){
     this.reportService.fetchWorkingDaysReport(this.organisationId).subscribe(response => {
       this.workingEndDate = response.data[0].end_date;
       this.workingDescription = response.data[0].description;
       this.dateDifference = response.data[0].date_difference;
       if(this.dateDifference<=3){
         this.showMessage=true;
       }else{
         this.showMessage=false;
       }
       console.log("dateDifference Days:",this.dateDifference);
     })
   } */
  getStudentToCourseRegistrationList($orgID: any) {
    this.reportService.fetchStudentToCourseRegistrationReport($orgID).subscribe(response => {
      this.studentRegistrationHistoryArray = response.data;
      console.log("StudentToCourseRegistration:", this.studentRegistrationHistoryArray);
    })
  }
  onStatusChange(id:any) {
    this.itemValue={
      id:id,
      inforce:status
    }
    Swal.fire({
      text: '',
      title: 'Are you sure ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.reportService.fetchCourseCompletedId(id).subscribe(
          (response: { success: number; }) => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Course has been completed..',
              showConfirmButton: false,
              timer: 1500
            });
            this.getStudentToCourseRegistrationList(this.organisationId);
            this.getStudentUpcomingDueList(this.organisationId);
            // this.showSuccess("Record added successfully");
            
            //console.log("success:",response.success);
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
  onlineExam() {
    /* window.location.href='https://easytestmaker.com/'; */
    window.open('https://easytestmaker.com/', '_blank', 'noopener, noreferrer');
  }



}

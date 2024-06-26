import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { Student } from 'src/app/models/student.model';
import { StudentToCourseService } from 'src/app/services/student-to-course.service';
import { StudentService } from 'src/app/services/student.service';
import { CommonService } from 'src/app/services/common.service';
import { StudentToCourse } from 'src/app/models/studenttocourse.model';
import { Table } from 'primeng/table/table';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2'
import { ThisReceiver } from '@angular/compiler';

interface Alert {
  type: string;
  message: string;
}
export interface section{
  id:string;
  sec:string;
}
@Component({
  selector: 'app-student-course-registration',
  templateUrl: './student-course-registration.component.html',
  styleUrls: ['./student-course-registration.component.scss'],
  providers: [ConfirmationService, MessageService]
})

export class StudentCourseRegistrationComponent implements OnInit {
  //studentList: Student[] =[];
  UserID: number = 0;
  organisationId: number = 0;

  fees_mode_type_name:any;
  course_code:any;
  short_name:any;
  course_duration:any;
  duration_name:any;
  description:any;
  courseFees:number=0;

  feesAmount:number=0;
  effective_Date: any;
  hiddenInput: boolean = false;
  isShown: boolean = false; // hidden by default
  isDashboard:boolean=true;
  isCourseDetails:boolean=false;
  isStudentDetails:boolean=false;
  students: any[] = [];
  courses: Course[] = [];
  durationTypes: any[] = [];
  feeModeTypeArray: any[] = [];
  courseDetailsArray:any[]=[];
  studentToCourseArray:any[]=[];
  totalNoActiveStudent: number = 0;
  totalNoMonthlyActiveStudent: number = 0;
  totalNoFullCourseActiveStudent: number = 0;
  feeModeTypeId: number = 0;
  globelLedgerId: number = 8;
  studentTocourses: StudentToCourse[] = [];
  ledger_id: any[] = [];
  event: any;
  course_id: any[] = [];
  studentToCourseFormGroup: FormGroup | any;
  tempItemValueObj!: object;
  tempGetActiveCourseObj!: object;
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
  showErrorMessage: boolean | undefined;
  errorMessage: any;
  public section :section[] = [
    {id: 'A', sec: 'A'},
    {id: 'B', sec: 'B'},
    {id: 'C', sec: 'C'},
    {id: 'D', sec: 'D'},
    {id: 'E', sec: 'E'},
    {id: 'F', sec: 'F'},
];
  msgs: { severity: string; summary: string; detail: string; }[] | undefined;

  constructor(private studentToCourseService: StudentToCourseService,
    private studentService: StudentService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public commonService: CommonService) {
    this.activatedRoute.data.subscribe((response: any) => {
      console.log(response);
      this.students = response.studentCourseRegistrationResolverData.students.data;
      this.durationTypes = response.studentCourseRegistrationResolverData.durationTypes.data;
      this.courses = response.studentCourseRegistrationResolverData.courses.data;
      this.studentTocourses = response.studentCourseRegistrationResolverData.studentTocourses.data;
      console.log("studentToCourse:", this.studentTocourses);
    });
    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }
  }
  //studentToCourseFormGroup: FormGroup | undefined ;
  ngOnInit(): void {

    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.studentToCourseFormGroup = new FormGroup({

      ledger_id: new FormControl(1, [Validators.required]),
      course_id: new FormControl(1, [Validators.required]),
      base_fee: new FormControl(null, [Validators.required]),
      discount_allowed: new FormControl(0, [Validators.required]),
      joining_date: new FormControl(val),
      effective_date: new FormControl(val),
      actual_course_duration: new FormControl(null, [Validators.required]),
      duration_type_id: new FormControl(1, [Validators.required]),
      studentToCourseID: new FormControl(0, [Validators.required]),
      transactionMasterID: new FormControl(0, [Validators.required]),
      section: new FormControl(null),
    })




    this.studentService.getStudentUpdateListener().subscribe((response: Student[]) => {
      this.students = response;
      console.log("Student list:", this.students);
    });

    this.ledger_id = [
      { value: 1, name: 'Nanda Gopal Sutradhar' },
      { value: 2, name: 'Sukanta HUi' }
    ];
    this.course_id = [
      { value: 1, name: 'CCIT' },
      { value: 2, name: 'DCA' }
    ];
    this.getTotalActiveStudent(this.organisationId);
    this.getMonthlyActiveStudent(this.organisationId);
    this.getFullCourseActiveStudent(this.organisationId);
  }
  getTotalActiveStudent($orgID: any) {
    this.studentToCourseService.fetchAllTotalActiveStudent($orgID).subscribe(response => {
      this.totalNoActiveStudent = response.data[0].totalActiveStudent;
      console.log("Monthly totalNoCourse:", this.totalNoActiveStudent);
    })
  }
  getStudentToCourseRegistrationList($orgID: any) {
    this.studentToCourseService.fetchAllStudentToCourses($orgID).subscribe(response => {
      this.studentTocourses = response.data;
      console.log("StudentToCourseRegistrationList:", this.studentTocourses);
    })
  }
  getMonthlyActiveStudent($orgID: any) {
    this.studentToCourseService.fetchMonthlyActiveStudent($orgID).subscribe(response => {
      this.totalNoMonthlyActiveStudent = response.data[0].totalMonthlyStudent;
      console.log("Monthly totalMonthlyCourse:", this.totalNoMonthlyActiveStudent);
    })
  }
  getFullCourseActiveStudent($orgID: any) {
    this.studentToCourseService.fetchFullCourseActiveStudent($orgID).subscribe(response => {
      this.totalNoFullCourseActiveStudent = response.data[0].totalFullCourseStudent;
      console.log("Monthly totalFullCourse:", this.totalNoFullCourseActiveStudent);
    })
  }
  active = 0;
  selectedIndex = 0;
  onTabChanged(event: any) {
    console.log(event)

  }
  clear(table: Table) {
    table.clear();
  }
  changeFeesModeType($event: any) {
    this.isCourseDetails=true;
    this.isDashboard=false;
    this.isStudentDetails=false;
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
  changeStudent($event: any) {
    this.isStudentDetails=true;
    this.isCourseDetails=false;
    this.isDashboard=false;
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
  getEventValue($event: any): string {
    return $event.target.value;
  }
  setEffectiveSQL(value: string) {
    this.studentToCourseFormGroup.patchValue({ effective_date: this.commonService.getSQLDate(value) });
  }
  setJoiningSQL(value: string) {
    this.studentToCourseFormGroup.patchValue({ joining_date: this.commonService.getSQLDate(value) });
  }
  
  cols: any[] = [
    { field: 'id', header: 'Student To Course ID', customExportHeader: 'Student To Course ID' },
    { field: 'ledger_id' },
    { field: 'course_id' },
    { field: 'base_fee' }

  ];
  isValidForm() {
    if (this.studentToCourseFormGroup.valid) {
      return true;

    } else {
      return false;

    }
  }
  saveStudentToCourse() {
    //alert("Testing");
    this.isCourseDetails=false;
    this.isDashboard=true;
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
          section: this.studentToCourseFormGroup.value.section,
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
            this.getTotalActiveStudent(this.organisationId);
            this.getMonthlyActiveStudent(this.organisationId);
            this.getFullCourseActiveStudent(this.organisationId);
            this.getStudentToCourseRegistrationList(this.organisationId);
            this.selectedIndex=0;
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
  editStudentToCourse(courseTostudentData: any) {
    this.isShown = true;
    this.selectedIndex = 1;
    this.event = 0;
    this.onTabChanged(this.event);
    console.log("courseTostudentData:", courseTostudentData);
    this.studentToCourseFormGroup.patchValue({ transactionMasterID: courseTostudentData.transaction_masters_id });
    this.studentToCourseFormGroup.patchValue({ studentToCourseID: courseTostudentData.id });
    this.studentToCourseFormGroup.patchValue({ ledger_id: courseTostudentData.ledger_id });
    this.studentToCourseFormGroup.patchValue({ course_id: courseTostudentData.course_id });
    this.studentToCourseFormGroup.patchValue({ base_fee: courseTostudentData.base_fee });
    this.studentToCourseFormGroup.patchValue({ discount_allowed: courseTostudentData.discount_allowed });
    this.studentToCourseFormGroup.patchValue({ joining_date: courseTostudentData.joining_date });
    this.studentToCourseFormGroup.patchValue({ effective_date: courseTostudentData.effective_date });
    this.studentToCourseFormGroup.patchValue({ actual_course_duration: courseTostudentData.actual_course_duration });
    this.studentToCourseFormGroup.patchValue({ duration_type_id: courseTostudentData.duration_type_id });

  }
  deleteStudentToCourse(courseTostudentData: any) {
    console.log("Delete data:", courseTostudentData);
    this.confirmationService.confirm({
      message: 'Do you want to Update this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //const index: number = this.myArray.indexOf(value);
        //this.myArray.splice(index, 1);
        //const index: number = this.studentTocourses.indexOf(courseTostudentData.id);
        let index = this.studentTocourses.findIndex(x => x.id === courseTostudentData.id);

        console.log("Array: ", this.studentTocourses);
        console.log("courseTostudentData: ", courseTostudentData.id);

        this.studentToCourseService.deleteStudentToCourse(courseTostudentData.id).subscribe(response => {
          //this.showSuccess("Record Deleted successfully");
          //let index = this.courses.findIndex(x => x.courseId === courseTostudentData.id);

          if (index !== -1) {
            this.studentTocourses.splice(index, 1);
            this.showSuccess("Record added successfully");
            console.log("index...", index);
          }
          this.selectedIndex = 0;
        }, error => {
          this.showErrorMessage = true;
          this.errorMessage = error.message;
          const alerts: Alert[] = [{
            type: 'success',
            message: this.errorMessage,
          }]
          setTimeout(() => {
            this.showErrorMessage = false;
          }, 20000);
          this.showError(error.statusText);
        })

      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }
  showError(statusText: any) {
    throw new Error('Method not implemented.');
  }
  showSuccess(arg0: string) {
    throw new Error('Method not implemented.');
  }

  updateStudentToCourse() {
    this.isCourseDetails=false;
    this.isDashboard=true;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Update This Record...?',
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
        console.log("this.globelLedgerId:", this.globelLedgerId);

        this.tempItemValueObj = {
          studentToCourseID: this.studentToCourseFormGroup.value.studentToCourseID,
          studentId: this.studentToCourseFormGroup.value.ledger_id,
          transactionMasterId: this.studentToCourseFormGroup.value.transactionMasterID,
          courseId: this.studentToCourseFormGroup.value.course_id,
          baseFee: this.studentToCourseFormGroup.value.base_fee,
          discountAllowed: this.studentToCourseFormGroup.value.discount_allowed,
          joiningDate: this.studentToCourseFormGroup.value.joining_date,
          effectiveDate: this.studentToCourseFormGroup.value.effective_date,
          actual_course_duration: this.studentToCourseFormGroup.value.actual_course_duration,
          duration_type_id: this.studentToCourseFormGroup.value.duration_type_id,
          section: this.studentToCourseFormGroup.value.section,
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
        this.studentToCourseService.updateStudentToCourse(this.tempItemValueObj).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Course Registration has been Updated',
              showConfirmButton: false,
              timer: 1500
            });
            this.clearStudentToCourse();
            this.getTotalActiveStudent(this.organisationId);
            this.getMonthlyActiveStudent(this.organisationId);
            this.getFullCourseActiveStudent(this.organisationId);
            this.getStudentToCourseRegistrationList(this.organisationId);
            this.selectedIndex=0;
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
  onClickAdd(){
    this.selectedIndex = 1;
  }
  clearStudentToCourse() {
    this.isCourseDetails=false;
    this.isStudentDetails=false;
    this.isDashboard=true;
    this.isShown = false;
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.studentToCourseFormGroup = new FormGroup({

      ledger_id: new FormControl(1, [Validators.required]),
      course_id: new FormControl(1, [Validators.required]),
      base_fee: new FormControl(null, [Validators.required]),
      discount_allowed: new FormControl(0, [Validators.required]),
      joining_date: new FormControl(val),
      effective_date: new FormControl(val),
      actual_course_duration: new FormControl(null, [Validators.required]),
      duration_type_id: new FormControl(1, [Validators.required]),
      studentToCourseID: new FormControl(0, [Validators.required]),
      section: new FormControl(null),
      //transactionMasterID: new FormControl(0, [Validators.required])
    })
  }
}


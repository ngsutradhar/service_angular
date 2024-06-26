import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StorageMap } from "@ngx-pwa/local-storage";
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { Course } from 'src/app/models/course.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { CourseService } from 'src/app/services/course.service';
import { Table } from "primeng/table";
import Swal from 'sweetalert2'
import * as FileSaver from "file-saver";
import { formatDate } from '@angular/common';


interface Alert {
  type: string;
  message: string;
}
@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  providers: [ConfirmationService, MessageService]

})

export class CourseComponent implements OnInit {
  UserID: number = 0;
  organisationId: number = 0;
  dialogContent: string = "";
  errorMessage: any;
  totalNoCourse: number = 0;
  lastCourseCode:any=0;
  totalMonthlyCourse: number = 0;
  totalFullCourse: number = 0;
  isShown: boolean = false; // hidden by default
  hiddenInput: boolean = false;
  showErrorMessage: boolean = false;
  showMessage: string = '';
  displayDialog: boolean = false;
  isLinear: boolean = false;
  event: any;
  feesModeTypeId: any;
  visibleSidebar2: boolean = false;
  courses: Course[] = [];
  durationTypes: any[] = [];
  feeModeType: any[] = [];
  courseData!: object;
  maxLength:number=255;
  msgs: { severity: string; summary: string; detail: string }[] = [];
  /* courseData: {
    courseId?:number;
    feesModeTypeId?:number;
    durationTypeId?: number;
    fullName?: string;
    courseCode?: string;
    shortName?: string;
    courseDuration?: string;
    description?: string;
  }={}; */

  constructor(public authService: AuthService
    , private messageService: MessageService
    , private activatedRoute: ActivatedRoute
    , private courseService: CourseService
    , private confirmationService: ConfirmationService
    , private primengConfig: PrimeNGConfig
    , private storage: StorageMap
    , private commonService: CommonService
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }
    this.getCourseList(this.organisationId);
    this.activatedRoute.data.subscribe((response: any) => {
      //this.courses = response.courseResolverData.courses.data;
      this.durationTypes = response.courseResolverData.durationTypes.data;
    });
  
  }

  ngOnInit(): void {
    
    // this.courses = this.courseService.getCourses();
    this.courseService.getCourseUpdateListener().subscribe((response: Course[]) => {
      this.courses = response;
    });
    this.feeModeType = [
      { value: 1, name: 'Monthly' },
      { value: 2, name: 'Single' }
    ];
    this.getLastCourse(this.organisationId);
    this.getTotalCourse(this.organisationId);
    this.getMonthlyTotalCourse(this.organisationId);
    this.getFullTotalCourse(this.organisationId);
    //this.descriptionLen=this.descriptionLen.length;
  }
  
  active = 0;
  selectedIndex = 0
  onTabChanged(event: any) {
    console.log(event)
  }
  getCourseList($orgID: any) {
    this.courseService.fetchAllCourses($orgID).subscribe(response => {
      this.courses = response.data;
      console.log("courseList:", this.courses);
    })
  }
  getLastCourse($orgID: any) {
    this.courseService.fetchLastCourse($orgID).subscribe(response => {
      this.lastCourseCode = response.data[0].course_code;
      console.log("Last Course code:", this.lastCourseCode);
    })
  }
  getTotalCourse($orgID: any) {
    this.courseService.fetchAllTotalCourse($orgID).subscribe(response => {
      this.totalNoCourse = response.data[0].totalCourse;
      console.log("Monthly totalNoCourse:", this.totalNoCourse);
    })
  }
  getMonthlyTotalCourse($orgID: any) {
    this.courseService.fetchMonthlyTotalCourse($orgID).subscribe(response => {
      this.totalMonthlyCourse = response.data[0].totalMonthlyCourse;
      console.log("Monthly totalMonthlyCourse:", this.totalMonthlyCourse);
    })
  }
  getFullTotalCourse($orgID: any) {
    this.courseService.fetchFullTotalCourse($orgID).subscribe(response => {
      this.totalFullCourse = response.data[0].totalFullCourse;
      console.log("Monthly totalFullCourse:", this.totalFullCourse);
    })
  }
  courseNameFormGroup = new FormGroup({
    feesModeTypeId: new FormControl(1, [Validators.required]),
    durationTypeId: new FormControl(2, [Validators.required]),
    fullName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(5)]),
    courseCode: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
    shortName: new FormControl(),
    courseDuration: new FormControl(),
    description: new FormControl(),
    courseId: new FormControl(),
    courseFeesId: new FormControl(0, [Validators.required]),
    courseFees:new FormControl(null, [Validators.required])
  })
  loading: boolean = false;
  deleteCourse(courseData: any) {
    this.confirmationService.confirm({
      message: 'Do you want to Update this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //const index: number = this.myArray.indexOf(value);
        //this.myArray.splice(index, 1);

        //const index: number = this.courses.indexOf(courseData.courseId);

        let index = this.courses.findIndex(x => x.courseId === courseData.courseId);

        console.log("Array: ", this.courses);
        console.log("courseData: ", courseData.courseId);
        this.courseService.deleteCourse(courseData.courseId).subscribe(response => {

          console.log("index...1:", response.success);
          if (index != -1) {

            this.courses.splice(index, 1);
            console.log("index...", index);
          }
          this.selectedIndex = 1;
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
  updateCourse() {
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    var DateObj = new Date(val);
    console.log("Month No:", DateObj.getMonth() + 1);
    console.log("Year No:", DateObj.getFullYear());
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'Update This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseData = {
          courseId: this.courseNameFormGroup.value.courseId,
          feesModeTypeId: this.courseNameFormGroup.value.feesModeTypeId,
          durationTypeId: this.courseNameFormGroup.value.durationTypeId,
          fullName: this.courseNameFormGroup.value.fullName,
          courseCode: this.courseNameFormGroup.value.courseCode,
          shortName: this.courseNameFormGroup.value.shortName,
          courseDuration: this.courseNameFormGroup.value.courseDuration,
          description: this.courseNameFormGroup.value.description,
          courseFeesId:this.courseNameFormGroup.value.courseFeesId,
          feesYear:DateObj.getFullYear(),
          feesMonth:DateObj.getMonth() + 1,
          feesAmount:this.courseNameFormGroup.value.courseFees,
          organisationId:this.organisationId
        }
        this.courseService.updateCourse(this.courseData).subscribe(response => {
          if (response.status === true) {

            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Course has been Updated',
              showConfirmButton: false,
              timer: 1500
            });
            this.clearCourse();
            this.getTotalCourse(this.organisationId);
            this.getMonthlyTotalCourse(this.organisationId);
            this.getFullTotalCourse(this.organisationId);
            this.getLastCourse(this.organisationId);
            this.getCourseList(this.organisationId);
            this.selectedIndex = 0;
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
  saveCourse() {
    //alert("Testing");
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        const now = new Date();
        let val = formatDate(now, 'yyyy-MM-dd', 'en');
        var DateObj = new Date(val);
        console.log("Month No:", DateObj.getMonth() + 1);
        console.log("Year No:", DateObj.getFullYear());

        this.courseData = {
          courseId: this.courseNameFormGroup.value.courseId,
          feesModeTypeId: this.courseNameFormGroup.value.feesModeTypeId,
          durationTypeId: this.courseNameFormGroup.value.durationTypeId,
          fullName: this.courseNameFormGroup.value.fullName,
          courseCode: this.courseNameFormGroup.value.courseCode,
          shortName: this.courseNameFormGroup.value.shortName,
          courseDuration: this.courseNameFormGroup.value.courseDuration,
          description: this.courseNameFormGroup.value.description,
          feesAmount:this.courseNameFormGroup.value.courseFees,
          feesYear:DateObj.getFullYear(),
          feesMonth:DateObj.getMonth() + 1,
          organisationId: this.organisationId
        }

        this.courseService.saveCourse(this.courseData).subscribe(response => {
          //this.showError = response.exception;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Course has been saved',
              showConfirmButton: false,
              timer: 1500
            });
           
            this.clearCourse();
            this.getTotalCourse(this.organisationId);
            this.getMonthlyTotalCourse(this.organisationId);
            this.getFullTotalCourse(this.organisationId);
            this.getLastCourse(this.organisationId);
            this.getCourseList(this.organisationId);
            this.selectedIndex = 0;
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
  onClickAdd(){
    this.selectedIndex = 1;
  }
  clearCourse() {
    this.isShown = false;
    //this.courseNameFormGroup.reset();
    this.courseNameFormGroup = new FormGroup({
      feesModeTypeId: new FormControl(1, [Validators.required]),
      durationTypeId: new FormControl(2, [Validators.required]),
      fullName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(5)]),
      courseCode: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
      shortName: new FormControl(),
      courseDuration: new FormControl(),
      description: new FormControl(),
      courseId: new FormControl(),
      courseFeesId: new FormControl(0, [Validators.required]),
      courseFees:new FormControl(null, [Validators.required])
    });
  }
  editCourse(courseData: any) {
    //this.isShown = true;
    this.selectedIndex = 1
    this.event = 0;
    this.onTabChanged(this.event);
    console.log(courseData);
    this.isShown = true;
    this.courseNameFormGroup.patchValue({ courseId: courseData.id });
    this.courseNameFormGroup.patchValue({ feesModeTypeId: courseData.fees_mode_type_id });
    this.courseNameFormGroup.patchValue({ durationTypeId: courseData.duration_type_id });

    this.courseNameFormGroup.patchValue({ fullName: courseData.full_name });
    this.courseNameFormGroup.patchValue({ courseCode: courseData.course_code });

    this.courseNameFormGroup.patchValue({ shortName: courseData.short_name });
    this.courseNameFormGroup.patchValue({ courseDuration: courseData.course_duration });
    this.courseNameFormGroup.patchValue({ courseFees: courseData.fees_amount });
    this.courseNameFormGroup.patchValue({ courseFeesId: courseData.course_fees_id });
    if(courseData.description===''){
      this.courseNameFormGroup.patchValue({ description:'Hi'});
    }else{
      this.courseNameFormGroup.patchValue({ description: courseData.description });
    }
   
    console.log(courseData);
  }
  showSuccess(successMessage: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: successMessage });
  }
  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Success', detail: message });
  }
  clear(table: Table) {
    table.clear();
  }
  cols: any[] = [
    { field: 'courseId', header: 'Course ID', customExportHeader: 'Course Code' },
    { field: 'courseCode' },
    { field: 'shortName' },
    { field: 'fullName' },
    { field: 'courseDuration' },
    { field: 'description' }
  ];

  getEventValue($event: any): string {
    return $event.target.value;
  }

  applyFilterGlobal($event: any, stringVal: any, dt: any) {
    dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  selectedCourses: any;
  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.courses);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

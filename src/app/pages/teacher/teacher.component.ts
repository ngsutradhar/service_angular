import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { Student } from "../../models/student.model";

import { MenuItem,  PrimeNGConfig } from "primeng/api";

import { Table } from "primeng/table";
import { environment } from "../../../environments/environment";
import { WebcamImage, WebcamInitError } from "ngx-webcam";
import { AuthService } from "../../services/auth.service";
import { CommonService } from "../../services/common.service";
import { ageGTE } from "../../custom-validator/age.validator";
import { Observable } from "rxjs";
import { filter, map, startWith } from 'rxjs/operators';
import { StorageMap } from "@ngx-pwa/local-storage";
import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2'
import { StudentToCourseService } from 'src/app/services/student-to-course.service';
import { Course } from 'src/app/models/course.model';
import { StudentToCourse } from 'src/app/models/studenttocourse.model';
import { CourseService } from 'src/app/services/course.service';
@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  
  myControl = new FormControl();
  qualifications: string[] = ['Graduate', 'Class V', 'Class VI', 'Class VII', 'Class VIII'];
  filteredQualifications: Observable<string[]> | undefined;
  error: any;
  feesAmount:number=0;
  loginType: any;
  students: Student[] = [];
  courses: Course[] = [];
  studentToCourseArray:any[]=[];
  studentTocourses: StudentToCourse[] = [];
  courseDetailsArray:any[]=[];
  organisationId: number = 0;
  msgs: { severity: string; summary: string; detail: string }[] = [];
  value3: any;
  data: any;
  displayDialog: boolean = false;
  isDeviceXS = false;
  event: any;
  items: MenuItem[] = [];

  activeIndex: number = 0;
  userData: any;
  userObject!: Object;
  UserID: any;
  teacherNameFormGroup: FormGroup;
  teacherGuardianFormGroup: FormGroup;
  teacherBasicFormGroup: FormGroup;
  teacherAddressFormGroup: FormGroup;
  teacherContactFormGroup: FormGroup;
  studentToCourseFormGroup: FormGroup | any;
  isLinear: boolean = false;
  relations: any[];
  sex: any[];
  genders: any[];
   billingName: string = '';
  guradainName: string = '';
  isProduction = environment.production;
  showDeveloperDiv = true;
  isCaptured: boolean = true;
  WIDTH = 200;
  HEIGHT = 200;
  date: any;
  public webcamImage: WebcamImage | undefined;
  dialogContent: string = "";
  optionSelected: any = '';
  stateSelected: any = '';
  guardianName: any = '';
  studentData: {
    studentId?: any;
    episodeId?: string;
    studentName?: string;
    billingName?: string;
    fatherName?: string;
    motherName?: string;
    guardianName?: string;
    relationToGuardian?: string;
    dob?: string;
    sex?: string;
    address?: string;
    city?: string;
    district?: string;
    stateId?: string;
    pin?: string;
    guardianContactNumber?: string;
    whatsappNumber?: string;
    email?: string;
    qualification?: string;
    userID?: number;
    subjectId?: number;
    organisationId?: number;
  } = {};
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
  stateList: any[] = [];
  subjectList:any[]=[];
  teacherList:any[]=[];
  durationTypes: any[] = [];
  visibleSidebar2: boolean = false;
  errorMessage: any;
  showErrorMessage: boolean = false;
  isShown: boolean = false; // hidden by default

  fees_mode_type_name:any;
  course_code:any;
  short_name:any;
  course_duration:any;
  duration_name:any;
  description:any;
  tempItemValueObj!: object;

  totalNoActiveStudent: number = 0;
  totalNoMonthlyActiveStudent: number = 0;
  totalNoFullCourseActiveStudent: number = 0;
  feeModeTypeId: number = 0;
  globelLedgerId: number = 8;
  effective_Date: any;
  tempGetActiveCourseObj!: object;
  hiddenInput: boolean = false;
  isDashboard:boolean=true;
  isCourseDetails:boolean=false;
  isStudentDetails:boolean=false;
  constructor(private studentToCourseService: StudentToCourseService
    ,private route: ActivatedRoute
    , public authService: AuthService
    , private activatedRoute: ActivatedRoute
    , private studentService: StudentService
    , private primengConfig: PrimeNGConfig
    , private storage: StorageMap
    , private commonService: CommonService
    , private courseService: CourseService,
  ) {
    this.activatedRoute.data.subscribe((response: any) => {
      console.log(response);
      this.students = response.studentCourseRegistrationResolverData.students.data;
      this.durationTypes = response.studentCourseRegistrationResolverData.durationTypes.data;
      this.courses = response.studentCourseRegistrationResolverData.courses.data;
      this.studentTocourses = response.studentCourseRegistrationResolverData.studentTocourses.data;
      console.log("studentToCourse:", this.studentTocourses);
    });

    this.storage.get('teacherNameFormGroup').subscribe((teacherNameFormGroup: any) => {
      if (teacherNameFormGroup) {
        this.teacherNameFormGroup.setValue(teacherNameFormGroup);
      }
    }, (error) => { });

    this.storage.get('teacherGuardianFormGroup').subscribe((teacherGuardianFormGroup: any) => {
      if (teacherGuardianFormGroup) {
        this.teacherGuardianFormGroup.setValue(teacherGuardianFormGroup);
      }
    }, (error) => { });

    this.storage.get('teacherBasicFormGroup').subscribe((teacherBasicFormGroup: any) => {
      if (teacherBasicFormGroup) {
        this.teacherBasicFormGroup.setValue(teacherBasicFormGroup);
      }
    }, (error) => { });


    /*  this.studentService.fetchEducations().then(educations => {
       this.qualifications = educations;
     }); */

 

   /*  this.route.data.subscribe((response: any) => {
      this.stateList = response.studentResolverData.states.data;
      console.log("Teacher state:",this.stateList);
    }); */

    this.genders = [
      { name: 'M', value: 'M', icon: 'bi bi-gender-male', tooltip: 'Male' },
      { name: 'F', value: 'F', icon: 'bi bi-gender-female', tooltip: 'Female' },
      { name: 'T', value: 'T', icon: 'bi bi-gender-trans', tooltip: 'Others' }
    ];

    this.relations = [
      { name: 'Father' },
      { name: 'Mother' },
      { name: 'Dadu' },
      { name: 'Dida' }
    ];

    this.sex = [
      { name: 'Male' },
      { name: 'Female' },
      { name: 'Others' },

    ];

    

    this.teacherNameFormGroup = new FormGroup({
      studentId: new FormControl(null),
      episodeId: new FormControl(null),
      studentName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      billingName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)])
    });
    this.teacherGuardianFormGroup = new FormGroup({
      fatherName: new FormControl(null),
      motherName: new FormControl(null),
      guardianName: new FormControl(null),
      relationToGuardian: new FormControl(null, [Validators.required])
    });

    this.teacherBasicFormGroup = new FormGroup({
      dob: new FormControl(null, [Validators.required, ageGTE(4)]),
      dobSQL: new FormControl(null),
      sex: new FormControl(null, Validators.required),
      qualification: new FormControl(null, Validators.required),
      subjectId: new FormControl(null)
    });
    this.teacherAddressFormGroup = new FormGroup({
      address: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      city: new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      district: new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      stateId: new FormControl(20),
      pin: new FormControl(null)

    });

    this.teacherContactFormGroup = new FormGroup({
      guardianContactNumber: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      whatsappNumber: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      description: new FormControl(null)
    });

  }
  active = 0;
  selectedIndex = 0;
  onTabChanged(event: any) {
    console.log(event)
  }
  clear(table: Table) {
    table.clear();
  }
  /* getEventValue($event:any) :string {
    return $event.target.value;
  } */
  isValidForm() {
    if (this.teacherNameFormGroup.valid && this.teacherGuardianFormGroup.valid && this.teacherBasicFormGroup.valid && this.teacherAddressFormGroup.valid && this.teacherContactFormGroup.valid) {
      return true;

    } else {
      return false;

    }
  }

  showDialog() {
    this.dialogContent = "Student Picture Saved";
    this.displayDialog = true;
  }
  sameAsBillName() {
    this.teacherNameFormGroup.patchValue({ billingName: this.teacherNameFormGroup.value.studentName });

  }
  sameAsWhatsAppNo() {
    this.teacherContactFormGroup.patchValue({ whatsappNumber: this.teacherContactFormGroup.value.guardianContactNumber });

  }
  guardianAsFather(father: any) {
    this.guardianName = '';
    this.guardianName = father;
    console.log(this.guardianName);
    this.optionSelected = 'Father';
    this.teacherGuardianFormGroup.patchValue({ guardianName: this.guardianName });
    this.teacherGuardianFormGroup.patchValue({ relationToGuardian: this.optionSelected });
  }
  guardianAsMother(mother: any) {
    this.guardianName = '';
    this.guardianName = mother;
    console.log(this.guardianName);
    this.optionSelected = 'Mother';
    this.teacherGuardianFormGroup.patchValue({ guardianName: this.guardianName });
    this.teacherGuardianFormGroup.patchValue({ relationToGuardian: this.optionSelected });
  }
  editStudent(studentData: any) {
    this.selectedIndex = 1;
    this.event = 0;
    this.onTabChanged(this.event);
    this.date = new Date();
    //const latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
    //const latest_date1 = this.datepipe.transform(this.date, 'dd-MM-yyyy');
    //console.log("convert date:", latest_date1);

    console.log("Editable data:", studentData);
    this.isShown = true;
    this.teacherNameFormGroup.patchValue({ studentId: studentData.studentId });
    this.teacherNameFormGroup.patchValue({ episodeId: studentData.episodeId });

    this.teacherNameFormGroup.patchValue({ studentName: studentData.studentName });
    this.teacherNameFormGroup.patchValue({ billingName: studentData.billingName });

    this.teacherGuardianFormGroup.patchValue({ fatherName: studentData.fatherName });
    this.teacherGuardianFormGroup.patchValue({ motherName: studentData.motherName });
    this.teacherGuardianFormGroup.patchValue({ guardianName: studentData.guardianName });


    //this.teacherBasicFormGroup.patchValue({dob: this.datepipe.transform(studentData.dobSQL, 'yyyy-MM-dd')});

    this.date = new Date(studentData.dob);
    this.teacherBasicFormGroup.patchValue({ dob: this.date });

    this.teacherBasicFormGroup.patchValue({ sex: studentData.sex });
    this.teacherBasicFormGroup.patchValue({ qualification: studentData.qualification });

    this.teacherAddressFormGroup.patchValue({ address: studentData.address });
    this.teacherAddressFormGroup.patchValue({ city: studentData.city });
    this.teacherAddressFormGroup.patchValue({ district: studentData.district });
    this.teacherAddressFormGroup.patchValue({ stateId: studentData.stateId });
    this.teacherAddressFormGroup.patchValue({ pin: studentData.pin });

    this.teacherContactFormGroup.patchValue({ guardianContactNumber: studentData.guardianContactNumber });
    this.teacherContactFormGroup.patchValue({ whatsappNumber: studentData.whatsappNumber });
    this.teacherContactFormGroup.patchValue({ email: studentData.email });
    this.teacherContactFormGroup.patchValue({ description: studentData.description });
  }
  ngOnInit(): void {

    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }
    this.getAllCourse(this.organisationId);
    this.getAllSubjects(this.organisationId);
    this.getAllTeachers(this.organisationId);
    this.getDurationTypes();
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
   
    /* this.userData=localStorage.getItem('user');
    console.log("user data:",(this.userData));
    this.userObject=JSON.parse(this.userData);
   
    console.log("user login data:",((Object.values(this.userObject)))); */
    // @ts-ignore
    /* this.filteredQualifications = this.teacherBasicFormGroup.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    ); */

    this.students = this.studentService.getStudents();
    this.studentService.getStudentUpdateListener().subscribe((response: Student[]) => {
      this.students = response;
    });

    this.studentService.fetchAllStates().subscribe((response:any)=>{
      this.stateList=response.data;
       console.log(this.stateList);
     })
    this.primengConfig.ripple = true;
    this.optionSelected = 'Father';
    this.stateSelected = 20;

    
   

    this.ngOnChanges();
  }

  //-----------------start student to course registration ------------------------------
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
  
  setEffectiveSQL(value: string) {
    this.studentToCourseFormGroup.patchValue({ effective_date: this.commonService.getSQLDate(value) });
  }
  setJoiningSQL(value: string) {
    this.studentToCourseFormGroup.patchValue({ joining_date: this.commonService.getSQLDate(value) });
  }
  
  
  getAllCourse($orgID:any){
    this.courseService.fetchAllCourses(this.organisationId).subscribe(response => {
      this.courses = response.data;
      console.log("courses list:", this.courses);
    })
  }
  getAllSubjects($orgID:any){
    this.courseService.fetchAllSubjects(this.organisationId).subscribe(response => {
      this.subjectList = response.data;
      console.log("subjectList list:", this.subjectList);
    })
  }
  getAllTeachers($orgID:any){
    this.studentService.fetchAllTeachers(this.organisationId).subscribe(response => {
      this.teacherList = response.data;
      console.log("teacherList list:", this.teacherList);
    })
  }
  getDurationTypes(){
    this.courseService.fetchAllDurationType().subscribe(response => {
      this.durationTypes = response.data;
      console.log("durationTypes list:", this.durationTypes);
    })
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
          isStarted: 1,
          userId: 1,
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
      //transactionMasterID: new FormControl(0, [Validators.required])
    })
  }
  //----------------- student to course registration ------------------------------

  deleteStudent(studentData: any) {
    /* this.confirmationService.confirm({
      message: 'Do you want to Update this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //const index: number = this.myArray.indexOf(value);
        //this.myArray.splice(index, 1);
        const index: number = this.students.indexOf(studentData.studentId);
        this.studentService.deleteStudent(studentData.studentId).subscribe(response => {
          this.showSuccess("Record Deleted successfully");
          let index = this.students.findIndex(x => x.studentId === studentData.studentId);
          if (index !== -1) {
            this.students.splice(index, 1);
          }

        }, error => {
          this.showErrorMessage = true;
          this.errorMessage = error.message;
          
        })

      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    }); */
  }
  isValidFormStudentToCourse() {
    if (this.studentToCourseFormGroup.valid) {
      return true;

    } else {
      return false;

    }
  }
  updateStudent() {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Update This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentData.studentId = this.teacherNameFormGroup.value.studentId;
        this.studentData.episodeId = this.teacherNameFormGroup.value.episodeId;
        this.studentData.studentName = this.teacherNameFormGroup.value.studentName;
        this.studentData.billingName = this.teacherNameFormGroup.value.billingName;
        this.studentData.fatherName = this.teacherGuardianFormGroup.value.fatherName;
        this.studentData.motherName = this.teacherGuardianFormGroup.value.motherName;
        this.studentData.guardianName = this.teacherGuardianFormGroup.value.guardianName;
        this.studentData.relationToGuardian = this.teacherGuardianFormGroup.value.relationToGuardian;

        //this.studentData.dob=this.teacherBasicFormGroup.value.dobSQL;
        this.studentData.dob = this.teacherBasicFormGroup.value.dobSQL;
        this.studentData.sex = this.teacherBasicFormGroup.value.sex;
        this.studentData.qualification = this.teacherBasicFormGroup.value.qualification;

        this.studentData.address = this.teacherAddressFormGroup.value.address;
        this.studentData.city = this.teacherAddressFormGroup.value.city;

        this.studentData.district = this.teacherAddressFormGroup.value.district;
        this.studentData.stateId = this.teacherAddressFormGroup.value.stateId;
        //this.studentData.stateId='10';
        this.studentData.pin = this.teacherAddressFormGroup.value.pin;

        this.studentData.guardianContactNumber = this.teacherContactFormGroup.value.guardianContactNumber;

        this.studentData.whatsappNumber = this.teacherContactFormGroup.value.whatsappNumber;
        this.studentData.email = this.teacherContactFormGroup.value.email;

        this.studentService.updateStudent(this.studentData).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Student has been Updated',
              showConfirmButton: false,
              timer: 1500
            });

            this.clearStudent();

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

  saveTeacher() {
    //console.log("jhjkhj");
    Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentData.studentName = this.teacherNameFormGroup.value.studentName;
        this.studentData.billingName = this.teacherNameFormGroup.value.billingName;
        this.studentData.fatherName = this.teacherGuardianFormGroup.value.fatherName;
        this.studentData.motherName = this.teacherGuardianFormGroup.value.motherName;
        this.studentData.guardianName = this.teacherGuardianFormGroup.value.guardianName;
        this.studentData.relationToGuardian = this.teacherGuardianFormGroup.value.relationToGuardian;

        this.studentData.dob = this.teacherBasicFormGroup.value.dobSQL;
        this.studentData.sex = this.teacherBasicFormGroup.value.sex;
        this.studentData.qualification = this.teacherBasicFormGroup.value.qualification;
        this.studentData.subjectId = this.teacherBasicFormGroup.value.subjectId;
        
        this.studentData.address = this.teacherAddressFormGroup.value.address;
        this.studentData.city = this.teacherAddressFormGroup.value.city;

        this.studentData.district = this.teacherAddressFormGroup.value.district;
        this.studentData.stateId = this.teacherAddressFormGroup.value.stateId;
        this.studentData.pin = this.teacherAddressFormGroup.value.pin;

        this.studentData.guardianContactNumber = this.teacherContactFormGroup.value.guardianContactNumber;

        this.studentData.whatsappNumber = this.teacherContactFormGroup.value.whatsappNumber;
        this.studentData.email = this.teacherContactFormGroup.value.email;
        this.studentData.organisationId = this.organisationId;

        this.studentService.saveTeacher(this.studentData).subscribe(response => {
          if (response.status === true) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Student has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            console.log("Return student data:", response.data);
            // this.showSuccess("Record added successfully");
            this.clearStudent();
            this.getAllTeachers(this.organisationId);
            this.selectedIndex=1;
            this.studentToCourseFormGroup.patchValue({ ledger_id: response.data.studentId });
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
  clearStudent() {
    this.isShown = false;
    this.teacherNameFormGroup.reset();
    this.teacherGuardianFormGroup.reset();
    this.teacherBasicFormGroup.reset();
    this.teacherAddressFormGroup.reset();
    this.teacherContactFormGroup.reset();
  }





  getEventValue($event: any): string {
    return $event.target.value;
  }

  setDobSQL(value: string) {
    this.teacherBasicFormGroup.patchValue({ dobSQL: this.commonService.getSQLDate(value) });
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

  saveUserImage() {
    if (this.webcamImage) {
      const arr = this.webcamImage.imageAsDataUrl.split(",");
      // @ts-ignore
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file: File = new File([u8arr], "test", { type: "jpeg" })
      this.authService.uploadStudentImage(file).subscribe((response) => {
        console.log(response);
        if (response.status === true) {
          this.showSuccess("Image saved");
        }
      }
      );
    }
  }
  showSuccess(arg0: string) {
    throw new Error('Method not implemented.');
  }



  

  /* private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.qualifications.filter(option => option.toLowerCase().includes(filterValue));
  } */

  ngOnChanges(): void {
    this.teacherNameFormGroup.valueChanges.subscribe(val => {
      this.storage.set('teacherNameFormGroup', this.teacherNameFormGroup.value).subscribe(() => { });
    });

    this.teacherGuardianFormGroup.valueChanges.subscribe(val => {
      this.storage.set('teacherGuardianFormGroup', this.teacherGuardianFormGroup.value).subscribe(() => { });
    });

    this.teacherBasicFormGroup.valueChanges.subscribe(val => {
      this.storage.set('teacherBasicFormGroup', this.teacherBasicFormGroup.value).subscribe(() => { });
    });


  }

}

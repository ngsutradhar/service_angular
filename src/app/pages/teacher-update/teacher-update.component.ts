import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-teacher-update',
  templateUrl: './teacher-update.component.html',
  styleUrls: ['./teacher-update.component.scss']
})
export class TeacherUpdateComponent implements OnInit {
  teacherRegistrationFormGroup!: FormGroup;
  stateList: any[] = [];
  organisationList: any[] = [];
  studentList:any[]=[];
  teacherList:any[]=[];
  showDiv:boolean=false;
  showDivStudentExists:boolean=false;
  organisationName: string = '';
  address: string = '';
  city: string = '';
  contactNumber: string = '';
  studentName:any;
  gurardainName:any;
  dob:any;
  qualification:any;
  emailId: string = '';
  organisationPin: string = '';
    emailMobileNoCheckNgModel:string='';
  successMessage:number=0;
  UserID:any;
  organisationId:number=0;
  studentData: {
    studentId?: any;
    episodeId?: string;
    studentName?: string;
    billingName?: string;
    fatherName?: string;
    motherName?: string;
    guardainName?: string;
    relation?: string;
    dob?: string;
    sex?: string;
    address?: string;
    city?: string;
    district?: string;
    stateId?: string;
    pin?: string;
    guardianContactNumber?: string;
    whatsappNumber?: string;
    emailId?: string;
    qualification?: string;
    userID?: number;
    organisationId?: number;
  } = {};
  constructor(private studentService: StudentService,
    public commonService: CommonService) { 
      const user = localStorage.getItem('user');
      if (user) {
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        console.log("user localUserID:", (this.UserID));
        console.log("user organisationId:", (this.organisationId));
      }
       this.getStateList(); 
       this.getOrganisationList();
       this.getAllTeachers(this.organisationId);
    }
  selectedIndex = 0
  onTabChanged(event: any) {
    console.log(event)
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  clear(table: Table) {
    table.clear();
  }
  onClickAdd(){
    this.selectedIndex = 1;
  }
  editTeacher(data:any){

  }
  deleteTeacher(data:any){

  }
  showDivClick(data:any){
    this.showDiv=true;
    console.log("data:", data);
    this.organisationName = data.organisation_name;
    this.address = data.address;
    this.city = data.city;;
    this.contactNumber = data.contact_number;;
    this.emailId = data.email_id;
    this.organisationPin = data.pin;
  }
  ngOnInit(): void {
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.teacherRegistrationFormGroup = new FormGroup({
      studentName: new FormControl(null,[Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      address: new FormControl(null,[Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      city: new FormControl(null),
      district: new FormControl(null),
      guardainName: new FormControl(null),
      qualification: new FormControl('B.TECH'),
      sex: new FormControl('M'),
      relation: new FormControl(null),
      pin: new FormControl(null),
      guardianContactNumber: new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      whatsappNumber:new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      emailId: new FormControl(null,[Validators.required, Validators.email]), 
      stateId: new FormControl(20),
      dob:new FormControl(val,[Validators.required])
    })
  }
 getStateList(){
    this.studentService.fetchAllStates().subscribe(response => {
      this.stateList=response.data;
      console.log("stateList:",this.stateList);
    })
  } 
  getOrganisationList(){
    this.organisationList=[];
    this.studentService.fetchAllOrganisaction().subscribe(response => {
      this.organisationList=response.data;
      console.log("organisationList:",this.organisationList);
    })
  } 
  getAllTeachers($orgID:any){
    this.studentService.fetchAllTeachers(this.organisationId).subscribe(response => {
      this.teacherList = response.data;
      console.log("teacherList list:", this.teacherList);
    })
  }
  onClearTeacher(){
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.teacherRegistrationFormGroup = new FormGroup({
      studentName: new FormControl(null,[Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      address: new FormControl(null,[Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      city: new FormControl(null),
      district: new FormControl(null),
      guardainName: new FormControl(null),
      qualification: new FormControl('B.TECH'),
      sex: new FormControl('M'),
      relation: new FormControl(null),
      pin: new FormControl(null),
      guardianContactNumber: new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      whatsappNumber: new FormControl(null),
      emailId: new FormControl(null,[Validators.required, Validators.email]), 
      stateId: new FormControl(20),
      dob:new FormControl(val,[Validators.required])
    })
  }
  onTeacherSave() {
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
        this.studentData.studentName = this.teacherRegistrationFormGroup.value.studentName;
        this.studentData.billingName = this.teacherRegistrationFormGroup.value.studentName;
       /*  this.studentData.fatherName = this.teacherRegistrationFormGroup.value.fatherName;
        this.studentData.motherName = this.teacherRegistrationFormGroup.value.motherName; */
        this.studentData.guardainName = this.teacherRegistrationFormGroup.value.guardainName;
        this.studentData.relation = this.teacherRegistrationFormGroup.value.relation;

        this.studentData.dob = this.teacherRegistrationFormGroup.value.dob;
        this.studentData.sex = this.teacherRegistrationFormGroup.value.sex;
        this.studentData.qualification = this.teacherRegistrationFormGroup.value.qualification;

        this.studentData.address = this.teacherRegistrationFormGroup.value.address;
        this.studentData.city = this.teacherRegistrationFormGroup.value.city;

        this.studentData.district = this.teacherRegistrationFormGroup.value.district;
        this.studentData.stateId = this.teacherRegistrationFormGroup.value.stateId;
        this.studentData.pin = this.teacherRegistrationFormGroup.value.pin;

        this.studentData.guardianContactNumber = this.teacherRegistrationFormGroup.value.guardianContactNumber;

        this.studentData.whatsappNumber = this.teacherRegistrationFormGroup.value.whatsappNumber;
        this.studentData.emailId = this.teacherRegistrationFormGroup.value.emailId;
        this.studentData.organisationId = this.organisationId;

        this.studentService.saveTeacherRegistration(this.studentData).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Teacher has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.onClearTeacher();
            console.log("Return student data:", response.data);
            this.selectedIndex=0;
            this.getAllTeachers(this.organisationId);
            //this.studentToCourseFormGroup.patchValue({ ledger_id: response.data.studentId });
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

  onGo($data:any){
    //this.emailMobileNoCheck= this.teacherRegistrationFormGroup.get('emailMobileNoCheck')?.value;
    console.log("test:",$data.target.value);
    let emailOrMobile=$data.target.value;
    this.studentService.fetchCheckStudentExists(emailOrMobile).subscribe(response => {
      this.studentList=response.data;
      this.successMessage=response.success;
      if(this.successMessage>0){
        this.showDivStudentExists=true;
        this.studentName = this.studentList[0].ledger_name;
        this.address = this.studentList[0].address;
        this.gurardainName = this.studentList[0].guardian_name;;
        this.dob = this.studentList[0].dob;
        this.qualification = this.studentList[0].qualification;
        this.organisationName=this.studentList[0].organisation_name;
      }
      else{
        this.showDivStudentExists=false;
      }
      console.log("studentList:",this.studentList);
      console.log("successMessage:",this.successMessage);
    })
  }
  sameAsWhatsAppNo() {
    this.teacherRegistrationFormGroup.patchValue({ guardianContactNumber: this.teacherRegistrationFormGroup.value.whatsappNumber });

  }
  setDOBSQL(value: string) {
    this.teacherRegistrationFormGroup.patchValue({ dob: this.commonService.getSQLDate(value) });
  }

}

import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent implements OnInit {
  studentRegistrationFormGroup!: FormGroup;
  stateList: any[] = [];
  organisationList: any[] = [];
  studentList:any[]=[];
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
       this.getStateList(); 
       this.getOrganisationList();
    }
  selectedIndex = 0
  onTabChanged(event: any) {
    console.log(event)
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
    this.studentRegistrationFormGroup = new FormGroup({
      organisationId: new FormControl(null,[Validators.required]),
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
  onClearStudent(){
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.studentRegistrationFormGroup = new FormGroup({
      emailMobileNoCheck: new FormControl(),
      organisationId: new FormControl(null,[Validators.required]),
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
  onStudentSave() {
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
        this.studentData.studentName = this.studentRegistrationFormGroup.value.studentName;
        this.studentData.billingName = this.studentRegistrationFormGroup.value.studentName;
       /*  this.studentData.fatherName = this.studentRegistrationFormGroup.value.fatherName;
        this.studentData.motherName = this.studentRegistrationFormGroup.value.motherName; */
        this.studentData.guardainName = this.studentRegistrationFormGroup.value.guardainName;
        this.studentData.relation = this.studentRegistrationFormGroup.value.relation;

        this.studentData.dob = this.studentRegistrationFormGroup.value.dob;
        this.studentData.sex = this.studentRegistrationFormGroup.value.sex;
        this.studentData.qualification = this.studentRegistrationFormGroup.value.qualification;

        this.studentData.address = this.studentRegistrationFormGroup.value.address;
        this.studentData.city = this.studentRegistrationFormGroup.value.city;

        this.studentData.district = this.studentRegistrationFormGroup.value.district;
        this.studentData.stateId = this.studentRegistrationFormGroup.value.stateId;
        this.studentData.pin = this.studentRegistrationFormGroup.value.pin;

        this.studentData.guardianContactNumber = this.studentRegistrationFormGroup.value.guardianContactNumber;

        this.studentData.whatsappNumber = this.studentRegistrationFormGroup.value.whatsappNumber;
        this.studentData.emailId = this.studentRegistrationFormGroup.value.emailId;
        this.studentData.organisationId = this.studentRegistrationFormGroup.value.organisationId;

        this.studentService.saveStudentRegistration(this.studentData).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Student has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.onClearStudent();
            console.log("Return student data:", response.data);
            // this.showSuccess("Record added successfully");
           // this.clearStudent();
           // this.selectedIndex=0;
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
    //this.emailMobileNoCheck= this.studentRegistrationFormGroup.get('emailMobileNoCheck')?.value;
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
    this.studentRegistrationFormGroup.patchValue({ guardianContactNumber: this.studentRegistrationFormGroup.value.whatsappNumber });

  }
  setDOBSQL(value: string) {
    this.studentRegistrationFormGroup.patchValue({ dob: this.commonService.getSQLDate(value) });
  }

}

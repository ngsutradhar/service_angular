import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
  UserID: number = 0;
  organisationId: number = 0;
  subjectsFormGroup!: FormGroup;
  durationTypes: any[] = [];
  hiddenInput:boolean=false;
  isShown:boolean=false;
  tempSubjectDataObject:object={};
  subjectArray:any[]=[];
  constructor(private courseService: CourseService) {
    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }

    this.getDuratioinTypes();
    this.getSubjectList(this.organisationId);
   }

  ngOnInit(): void {
    this.subjectsFormGroup = new FormGroup({
    durationTypeId: new FormControl(2, [Validators.required]),
    subjectFullName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(5)]),
    subjectCode: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
    subjectShortName: new FormControl(),
    subjectDuration: new FormControl(),
    subjectDescription: new FormControl(),
    subjectId: new FormControl(),
    })
  }

  selectedIndex=0;
  onTabChanged(event:any){
    console.log(event)
  }
  onClickAdd(){
    this.selectedIndex = 1;
  }
  getDuratioinTypes() {
    this.courseService.fetchAllDurationType().subscribe(response => {
      this.durationTypes = response.data;
      console.log("SubjectList:", this.durationTypes);
    })
  }
  clearSubject(){
    this.subjectsFormGroup = new FormGroup({
      durationTypeId: new FormControl(2, [Validators.required]),
      subjectFullName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(5)]),
      subjectCode: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
      subjectShortName: new FormControl(),
      subjectDuration: new FormControl(),
      subjectDescription: new FormControl(),
      subjectId: new FormControl(),
      })
  }
  getSubjectList($orgID: any) {
    this.courseService.fetchAllSubject($orgID).subscribe(response => {
      this.subjectArray = response.data;
      console.log("subjectArrayProblem:", this.subjectArray);
    })
  }
  saveSubject(){
    this.tempSubjectDataObject={
      durationTypeId: this.subjectsFormGroup.value.durationTypeId,
      subjectFullName: this.subjectsFormGroup.value.subjectFullName,
      subjectCode: this.subjectsFormGroup.value.subjectCode,
      subjectShortName: this.subjectsFormGroup.value.subjectShortName,
      subjectDuration: this.subjectsFormGroup.value.subjectDuration,
      subjectDescription: this.subjectsFormGroup.value.subjectDescription,
      organisationId: this.organisationId
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.saveSubject(this.tempSubjectDataObject).subscribe(response => {
          /* this.referenceTransactionMasterId = response.data.transactionMasterId; */
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Subject has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.clearSubject();
            this.getSubjectList(this.organisationId);
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
  updateSubject(){

  }
  editSubject(data:any){

  }
  deleteSubject(data:any){

  }
  clear(table: Table) {
    table.clear();
  } 
  getEventValue($event:any) :string {
    return $event.target.value;
  }
}

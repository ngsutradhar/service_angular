import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subject-to-course',
  templateUrl: './subject-to-course.component.html',
  styleUrls: ['./subject-to-course.component.scss']
})
export class SubjectToCourseComponent implements OnInit {
  coursesArray: any[] = [];
  subjectArray: any[] = [];
  tempSubjectArray: any = [];
  UserID: number = 0;
  organisationId: number = 0;
  isShowReport:boolean=false;
  isSelectedSubjectBoolean:boolean=false;
  tempItemObj!: object;
  subjectId:number=0;
  courseId:number=0;
  subjectName:string='';
  subjectToCourseFormGroup: FormGroup | any;
  selectedSubjectFormGroup: FormGroup | any;
  constructor(public authService: AuthService
      , private courseService: CourseService
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }
    this.getCourseList(this.organisationId);
    //this.chooseSubject(this.organisationId);
  }

  ngOnInit(): void {
    this.subjectToCourseFormGroup = new FormGroup({
      course_id: new FormControl(null, [Validators.required]),
    });

    this.selectedSubjectFormGroup = new FormGroup({
      course_id: new FormControl(null, [Validators.required]),
    })
  }

  getCourseList($orgID: any) {
    this.courseService.fetchAllCourses($orgID).subscribe(response => {
      this.coursesArray = response.data;
      console.log("courseListarray:", this.coursesArray);
    })
  }
  chooseSubject(event:any){
    console.log("choose course id:",event.id);
    this.courseId=event.id;
    this.isShowReport=true;
    this.courseService.fetchAllSubjects(this.organisationId).subscribe(response => {
      this.subjectArray = response.data;
      console.log("SubjectListarray:", this.subjectArray);
    })
  }
  onSelectedItem(data:any){
    this.isSelectedSubjectBoolean=true;
    console.log("Main selected data:",data);
    this.subjectId=data.id;
    this.subjectName=data.subject_full_name;
    this.tempItemObj = {
      courseId:this.courseId,
      subjectId: this.subjectId,
      subjectName: this.subjectName,
      organisationId:this.organisationId
    }
    this.tempSubjectArray.push(this.tempItemObj);
    console.log(this.tempItemObj);
  }
  onDelete(indexNo:any){
    const x = this.tempSubjectArray[indexNo];
    this.tempSubjectArray.splice(indexNo, 1);

  }
  onSave(){
    this.tempItemObj={};
    this.tempItemObj = {
      subjectDetails: Object.values(this.tempSubjectArray)
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
        this.courseService.saveSubjectToCourse(this.tempItemObj).subscribe(response => {
          /* this.referenceTransactionMasterId = response.data.transactionMasterId; */
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Subject to Course has been saved',
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
  clear(table: Table) {
    table.clear();
  } 
  getEventValue($event:any) :string {
    return $event.target.value;
  }
}

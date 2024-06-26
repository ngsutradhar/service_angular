import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
import Swal from 'sweetalert2';
import { CourseService } from 'src/app/services/course.service';
@Component({
  selector: 'app-teacher-ebook',
  templateUrl: './teacher-ebook.component.html',
  styleUrls: ['./teacher-ebook.component.scss']
})
export class TeacherEbookComponent implements OnInit {

  UserID: number = 0;
  organisationId: number = 0;
  userName:string='';
  files:any;
  data: any;
  syllabusObject: any;
  ebookDataArray:any[]=[];
  defaultPicture: string = "";
  inActiveStatus:number=0;
  activeStatus:number=1;
  constructor(private reportService: ReportService,
    private courseService: CourseService, public commonService: CommonService) {
      const user = localStorage.getItem('user');
      if (user) {
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        this.userName = JSON.parse(<string>user).userName;
        console.log("user localUserID:", (this.UserID));
        console.log("user organisationId:", (this.organisationId));
        console.log("user userName:", (this.userName));

      }
      this.getEbookList(this.organisationId);
      this.getCourseList(this.organisationId);
     }
  selectedIndex=0;
  courseArray:any[]=[];
  subjectArray:any[]=[];
  teacherEbookPaperFormGroup!: FormGroup;
  ngOnInit(): void {
    this.defaultPicture = this.commonService.getPublic() + '/ebook_upload/';
    this.teacherEbookPaperFormGroup = new FormGroup({
      ebookDescription: new FormControl(null, [Validators.required]),
      course_id: new FormControl(null),
      subject_id: new FormControl(null),
      image: new FormControl(null),
      uploaded_by: new FormControl(null),
      organisationId:new FormControl(this.organisationId),
      userId:new FormControl(this.UserID)
    })
    this.teacherEbookPaperFormGroup.patchValue({ uploaded_by: this.userName });
  }
  onTabChanged(event:any){
    console.log(event)
  }
  onClickAdd(){
    this.selectedIndex = 1;
  }
  getCourseList($orgID: any) {
    this.courseService.fetchAllCourses($orgID).subscribe(response => {
      this.courseArray = response.data;
      console.log("courseList:", this.courseArray);
    })
  }
  getSubjectList($couseID: any) {
    this.subjectArray=[];
    this.teacherEbookPaperFormGroup.patchValue({ subject_id: '' });
    this.reportService.fetchSubjectListByCourseId($couseID).subscribe(response => {
      this.subjectArray = response.data;
      console.log("subjectsArray:", this.subjectArray);
      /*for (let val of this.subjectsArray) {
         this.tempItemObj = {
          ledgerId: val.ledger_id,
          transactionTypeId: 2,
          feesName: val.ledger_name,
          amount: val.amount

        } */
    })
  }
  chooseSubject(data:any){
    console.log("chooseSubject:",data);
     this.getSubjectList(data.id);
    /*this.tempObject={
        couseId:data.id,
        organisationId:this.organisationId
      }
    this.getStudentList(this.tempObject); */
  }
  uploadImage(event:any){
    this.files=event.target.files[0];
    console.log("Image:",this.files);
  }
  getEbookList($orgID: any) {
    this.reportService.fetchEbookListReport($orgID).subscribe(response => {
      this.ebookDataArray = response.data;
      console.log("ebookDataArray:", this.ebookDataArray);
    })
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  clear(table: Table) {
    table.clear();
  } 
  saveQuestionPaper() {
    //alert("Testing");
    //this.syllabusDataArray=[];
    Swal.fire({
      title: 'Are you sure?',
      text: 'To Save This Record!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        if((this.files) && (this.teacherEbookPaperFormGroup.value.ebookDescription) && (this.teacherEbookPaperFormGroup.value.course_id) && (this.teacherEbookPaperFormGroup.value.subject_id))
          {
          const formData= new FormData();
          formData.append("image",this.files, this.files.name);
          formData.append("courseId",this.teacherEbookPaperFormGroup.value.course_id);
          formData.append("subject_id",this.teacherEbookPaperFormGroup.value.subject_id);
          formData.append("organisationId",this.teacherEbookPaperFormGroup.value.organisationId);
          formData.append("ebookDescription",this.teacherEbookPaperFormGroup.value.ebookDescription);
          formData.append("uploaded_by",this.teacherEbookPaperFormGroup.value.uploaded_by);
          formData.append("user_id",this.teacherEbookPaperFormGroup.value.userId);
          //this.syllabusObject=formData;
          this.courseService.ebookUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log("Save Assignment:",this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'E - Book has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getEbookList(this.organisationId);
              this.teacherEbookPaperFormGroup = new FormGroup({
                ebookDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                subject_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId),
                userId:new FormControl(this.UserID)
              })
              
            }
          })
        }
        else if((this.files) && (this.teacherEbookPaperFormGroup.value.ebookDescription) && (this.teacherEbookPaperFormGroup.value.course_id) && (!this.teacherEbookPaperFormGroup.value.subject_id))
          {
          const formData= new FormData();
          formData.append("image",this.files, this.files.name);
          formData.append("courseId",this.teacherEbookPaperFormGroup.value.course_id);
          formData.append("organisationId",this.teacherEbookPaperFormGroup.value.organisationId);
          formData.append("ebookDescription",this.teacherEbookPaperFormGroup.value.ebookDescription);
          formData.append("uploaded_by",this.teacherEbookPaperFormGroup.value.uploaded_by);
          formData.append("user_id",this.teacherEbookPaperFormGroup.value.userId);
          //this.syllabusObject=formData;
          this.courseService.ebookUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log("Save Assignment:",this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'E - Book has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getEbookList(this.organisationId);
              this.teacherEbookPaperFormGroup = new FormGroup({
                ebookDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                subject_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId),
                userId:new FormControl(this.UserID)
              })
              
            }
          })
        }
        else if((this.files) && (this.teacherEbookPaperFormGroup.value.ebookDescription)){
          const formData= new FormData();
          formData.append("image",this.files, this.files.name);
          formData.append("organisationId",this.teacherEbookPaperFormGroup.value.organisationId);
          formData.append("ebookDescription",this.teacherEbookPaperFormGroup.value.ebookDescription);
          formData.append("uploaded_by",this.teacherEbookPaperFormGroup.value.uploaded_by);
          this.courseService.ebookUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log(this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'E - Book has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getEbookList(this.organisationId);
              this.teacherEbookPaperFormGroup = new FormGroup({
                ebookDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                subject_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId),
                userId:new FormControl(this.UserID)
              })
             
            }
          })
        }else if((this.teacherEbookPaperFormGroup.value.course_id) && (this.teacherEbookPaperFormGroup.value.subject_id)){
          const formData= new FormData();
          formData.append("courseId",this.teacherEbookPaperFormGroup.value.course_id);
          formData.append("subject_id",this.teacherEbookPaperFormGroup.value.subject_id);
          formData.append("organisationId",this.teacherEbookPaperFormGroup.value.organisationId);
          formData.append("ebookDescription",this.teacherEbookPaperFormGroup.value.ebookDescription);
          formData.append("uploaded_by",this.teacherEbookPaperFormGroup.value.uploaded_by);
          this.courseService.ebookUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log(this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'E - Book has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getEbookList(this.organisationId);
              this.teacherEbookPaperFormGroup = new FormGroup({
                ebookDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                subject_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId),
                userId:new FormControl(this.UserID)
              })
              
            }
          })
        }
        else{
          const formData= new FormData();
          formData.append("organisationId",this.teacherEbookPaperFormGroup.value.organisationId);
          formData.append("ebookDescription",this.teacherEbookPaperFormGroup.value.ebookDescription);
          formData.append("uploaded_by",this.teacherEbookPaperFormGroup.value.uploaded_by);
          this.courseService.ebookUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log(this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'E - Book has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getEbookList(this.organisationId);
              this.teacherEbookPaperFormGroup = new FormGroup({
                ebookDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                subject_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId),
                userId:new FormControl(this.UserID)
              })
             
            }
          })
        }
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
  onChange(status:number,id:any){

  }
  editAssignment(data:any){
    console.log("newsDataEdit:", data);
  }
  deleteAssignment(data:any){
    console.log("newsDataDelete:", data);
  }
}

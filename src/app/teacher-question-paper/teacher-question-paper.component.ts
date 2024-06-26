import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { CommonService } from 'src/app/services/common.service';
import { CourseService } from 'src/app/services/course.service';
import { ReportService } from 'src/app/services/report.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-teacher-question-paper',
  templateUrl: './teacher-question-paper.component.html',
  styleUrls: ['./teacher-question-paper.component.scss']
})
export class TeacherQuestionPaperComponent implements OnInit {

  UserID: number = 0;
  organisationId: number = 0;
  userName:string='';
  files:any;
  data: any;
  syllabusObject: any;
  questionDataArray:any[]=[];
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
      this.getQuestionPaperList(this.organisationId);
      this.getCourseList(this.organisationId);
     }
  selectedIndex=0;
  courseArray:any[]=[];
  subjectArray:any[]=[];
  teacherQuestionPaperFormGroup!: FormGroup;
  ngOnInit(): void {
    this.defaultPicture = this.commonService.getPublic() + '/question_upload/';
    this.teacherQuestionPaperFormGroup = new FormGroup({
      questionDescription: new FormControl(null, [Validators.required]),
      course_id: new FormControl(null),
      subject_id: new FormControl(null),
      image: new FormControl(null),
      uploaded_by: new FormControl(null),
      organisationId:new FormControl(this.organisationId),
      userId:new FormControl(this.UserID)
    })
    this.teacherQuestionPaperFormGroup.patchValue({ uploaded_by: this.userName });
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
    this.teacherQuestionPaperFormGroup.patchValue({ subject_id: '' });
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
  getQuestionPaperList($orgID: any) {
    this.reportService.fetchQuestionPaperListReport($orgID).subscribe(response => {
      this.questionDataArray = response.data;
      console.log("questionDataArray:", this.questionDataArray);
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
        if((this.files) && (this.teacherQuestionPaperFormGroup.value.questionDescription) && (this.teacherQuestionPaperFormGroup.value.course_id) && (this.teacherQuestionPaperFormGroup.value.subject_id))
          {
          const formData= new FormData();
          formData.append("image",this.files, this.files.name);
          formData.append("courseId",this.teacherQuestionPaperFormGroup.value.course_id);
          formData.append("subject_id",this.teacherQuestionPaperFormGroup.value.subject_id);
          formData.append("organisationId",this.teacherQuestionPaperFormGroup.value.organisationId);
          formData.append("questionDescription",this.teacherQuestionPaperFormGroup.value.questionDescription);
          formData.append("uploaded_by",this.teacherQuestionPaperFormGroup.value.uploaded_by);
          formData.append("user_id",this.teacherQuestionPaperFormGroup.value.userId);
          //this.syllabusObject=formData;
          this.courseService.questionUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log("Save Assignment:",this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Question has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getQuestionPaperList(this.organisationId);
              this.teacherQuestionPaperFormGroup = new FormGroup({
                questionDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                subject_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId),
                userId:new FormControl(this.UserID)
              })
              
            }
          })
        }
        else if((this.files) && (this.teacherQuestionPaperFormGroup.value.questionDescription) && (this.teacherQuestionPaperFormGroup.value.course_id) && (!this.teacherQuestionPaperFormGroup.value.subject_id))
          {
          const formData= new FormData();
          formData.append("image",this.files, this.files.name);
          formData.append("courseId",this.teacherQuestionPaperFormGroup.value.course_id);
          formData.append("organisationId",this.teacherQuestionPaperFormGroup.value.organisationId);
          formData.append("questionDescription",this.teacherQuestionPaperFormGroup.value.questionDescription);
          formData.append("uploaded_by",this.teacherQuestionPaperFormGroup.value.uploaded_by);
          formData.append("user_id",this.teacherQuestionPaperFormGroup.value.userId);
          //this.syllabusObject=formData;
          this.courseService.questionUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log("Save Assignment:",this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Question has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getQuestionPaperList(this.organisationId);
              this.teacherQuestionPaperFormGroup = new FormGroup({
                questionDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                subject_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId),
                userId:new FormControl(this.UserID)
              })
              
            }
          })
        }
        else if((this.files) && (this.teacherQuestionPaperFormGroup.value.questionDescription)){
          const formData= new FormData();
          formData.append("image",this.files, this.files.name);
          formData.append("organisationId",this.teacherQuestionPaperFormGroup.value.organisationId);
          formData.append("questionDescription",this.teacherQuestionPaperFormGroup.value.questionDescription);
          formData.append("uploaded_by",this.teacherQuestionPaperFormGroup.value.uploaded_by);
          this.courseService.questionUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log(this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Question has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getQuestionPaperList(this.organisationId);
              this.teacherQuestionPaperFormGroup = new FormGroup({
                questionDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                subject_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId),
                userId:new FormControl(this.UserID)
              })
             
            }
          })
        }else if((this.teacherQuestionPaperFormGroup.value.course_id) && (this.teacherQuestionPaperFormGroup.value.subject_id)){
          const formData= new FormData();
          formData.append("courseId",this.teacherQuestionPaperFormGroup.value.course_id);
          formData.append("subject_id",this.teacherQuestionPaperFormGroup.value.subject_id);
          formData.append("organisationId",this.teacherQuestionPaperFormGroup.value.organisationId);
          formData.append("questionDescription",this.teacherQuestionPaperFormGroup.value.questionDescription);
          formData.append("uploaded_by",this.teacherQuestionPaperFormGroup.value.uploaded_by);
          this.courseService.questionUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log(this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Question has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getQuestionPaperList(this.organisationId);
              this.teacherQuestionPaperFormGroup = new FormGroup({
                questionDescription: new FormControl(null, [Validators.required]),
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
          formData.append("organisationId",this.teacherQuestionPaperFormGroup.value.organisationId);
          formData.append("questionDescription",this.teacherQuestionPaperFormGroup.value.questionDescription);
          formData.append("uploaded_by",this.teacherQuestionPaperFormGroup.value.uploaded_by);
          this.courseService.questionUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log(this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Question has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getQuestionPaperList(this.organisationId);
              this.teacherQuestionPaperFormGroup = new FormGroup({
                questionDescription: new FormControl(null, [Validators.required]),
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

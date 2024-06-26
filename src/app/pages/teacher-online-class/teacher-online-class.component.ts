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
  selector: 'app-teacher-online-class',
  templateUrl: './teacher-online-class.component.html',
  styleUrls: ['./teacher-online-class.component.scss']
})
export class TeacherOnlineClassComponent implements OnInit {
  UserID: number = 0;
  organisationId: number = 0;
  userName:string='';
  files:any;
  data: any;
  syllabusObject: any;
  onlineClassDataArray:any[]=[];
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
      this.getOnlineClassList(this.organisationId);
      this.getCourseList(this.organisationId);
     }
  selectedIndex=0;
  courseArray:any[]=[];
  subjectArray:any[]=[];
  teacherOnlineClassFormGroup!: FormGroup;
  ngOnInit(): void {
    this.defaultPicture = this.commonService.getPublic() + '/ebook_upload/';
    this.teacherOnlineClassFormGroup = new FormGroup({
      pasteUrl: new FormControl(null, [Validators.required]),
      course_id: new FormControl(null),
      subject_id: new FormControl(null),
      uploaded_by: new FormControl(null),
      organisationId:new FormControl(this.organisationId),
      userId:new FormControl(this.UserID)
    })
    this.teacherOnlineClassFormGroup.patchValue({ uploaded_by: this.userName });
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
    this.teacherOnlineClassFormGroup.patchValue({ subject_id: '' });
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
  
  getOnlineClassList($orgID: any) {
    this.reportService.fetchOnlineClassReport($orgID).subscribe(response => {
      this.onlineClassDataArray = response.data;
      console.log("onlineClassDataArray:", this.onlineClassDataArray);
    })
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  clear(table: Table) {
    table.clear();
  } 
  saveOnline() {
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
        if((this.teacherOnlineClassFormGroup.value.pasteUrl) && (this.teacherOnlineClassFormGroup.value.course_id) && (this.teacherOnlineClassFormGroup.value.subject_id))
          {
          const formData= new FormData();
          formData.append("courseId",this.teacherOnlineClassFormGroup.value.course_id);
          formData.append("subject_id",this.teacherOnlineClassFormGroup.value.subject_id);
          formData.append("organisationId",this.teacherOnlineClassFormGroup.value.organisationId);
          formData.append("pasteUrl",this.teacherOnlineClassFormGroup.value.pasteUrl);
          formData.append("uploaded_by",this.teacherOnlineClassFormGroup.value.uploaded_by);
          formData.append("user_id",this.teacherOnlineClassFormGroup.value.userId);
          //this.syllabusObject=formData;
          this.courseService.saveOnlineClass(formData).subscribe(response=>{
            this.data=response;
            console.log("Save Assignment:",this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Online Class has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getOnlineClassList(this.organisationId);
              this.teacherOnlineClassFormGroup = new FormGroup({
                pasteUrl: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                subject_id: new FormControl(null),
                organisationId:new FormControl(this.organisationId),
                userId:new FormControl(this.UserID)
              })
              this.selectedIndex=0;
              
            }
          })
        }
        else if((this.teacherOnlineClassFormGroup.value.pasteUrl) && (this.teacherOnlineClassFormGroup.value.course_id) && (!this.teacherOnlineClassFormGroup.value.subject_id))
          {
          const formData= new FormData();
          formData.append("courseId",this.teacherOnlineClassFormGroup.value.course_id);
          formData.append("organisationId",this.teacherOnlineClassFormGroup.value.organisationId);
          formData.append("pasteUrl",this.teacherOnlineClassFormGroup.value.pasteUrl);
          formData.append("uploaded_by",this.teacherOnlineClassFormGroup.value.uploaded_by);
          formData.append("user_id",this.teacherOnlineClassFormGroup.value.userId);
36
          this.courseService.saveOnlineClass(formData).subscribe(response=>{
            this.data=response;
            console.log("Save Assignment:",this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Online Class has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getOnlineClassList(this.organisationId);
              this.teacherOnlineClassFormGroup = new FormGroup({
                pasteUrl: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                subject_id: new FormControl(null),
                organisationId:new FormControl(this.organisationId),
                userId:new FormControl(this.UserID)
              })
              this.selectedIndex=0;
            }
          })
        }
        else if((this.teacherOnlineClassFormGroup.value.pasteUrl)){
          const formData= new FormData();
          formData.append("organisationId",this.teacherOnlineClassFormGroup.value.organisationId);
          formData.append("pasteUrl",this.teacherOnlineClassFormGroup.value.pasteUrl);
          formData.append("uploaded_by",this.teacherOnlineClassFormGroup.value.uploaded_by);
          this.courseService.saveOnlineClass(formData).subscribe(response=>{
            this.data=response;
            console.log(this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Online Class has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getOnlineClassList(this.organisationId);
              this.teacherOnlineClassFormGroup = new FormGroup({
                pasteUrl: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                subject_id: new FormControl(null),
                organisationId:new FormControl(this.organisationId),
                userId:new FormControl(this.UserID)
              })
              this.selectedIndex=0;
            }
          })
        }
        //}
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

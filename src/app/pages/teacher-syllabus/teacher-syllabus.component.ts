import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { CommonService } from 'src/app/services/common.service';
import { CourseService } from 'src/app/services/course.service';
import { ReportService } from 'src/app/services/report.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-teacher-syllabus',
  templateUrl: './teacher-syllabus.component.html',
  styleUrls: ['./teacher-syllabus.component.scss']
})
export class TeacherSyllabusComponent implements OnInit {
  UserID: number = 0;
  organisationId: number = 0;
  teacherSyllabusFormGroup!: FormGroup;
  newsSaveData!: object;

  syllabusObject!:object;
  syllabusDataArray:any[]=[];
  activeStatus:number=1;
  inActiveStatus:number=0;
  courseArray:any[]=[];
  itemValue!: object;
  defaultPicture: string = "";
  files:any;
  data:any;
  constructor(private reportService: ReportService,
    private courseService: CourseService, public commonService: CommonService) { 
      const user = localStorage.getItem('user');
      if (user) {
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        console.log("user localUserID:", (this.UserID));
        console.log("user organisationId:", (this.organisationId));
      }
      this.getsyllabusList(this.organisationId);
      this.getCourseList(this.organisationId);
    }
    selectedIndex=0;
    onTabChanged(event:any){
      console.log(event)
    }
  ngOnInit(): void {
    this.defaultPicture = this.commonService.getPublic() + '/syllabus_upload/';
    this.teacherSyllabusFormGroup = new FormGroup({
      syllabusDescription: new FormControl(null, [Validators.required]),
      course_id: new FormControl(null),
      image: new FormControl(null),
      organisationId:new FormControl(this.organisationId)
    })
  }
  uploadImage(event:any){
    this.files=event.target.files[0];
    console.log("Image:",this.files);
  }
  getCourseList($orgID: any) {
    this.courseService.fetchAllCourses($orgID).subscribe(response => {
      this.courseArray = response.data;
      console.log("courseList:", this.courseArray);
    })
  }
  editSyllabus(data:any){
    console.log("newsDataEdit:", data);
  }
  deleteSyllabus(data:any){
    console.log("newsDataDelete:", data);
  }
  onChange(status:number,id:any) {
    
    this.itemValue={
      id:id,
      inforce:status
    }
    Swal.fire({
      text: '',
      title: 'Are you sure ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.reportService.updateNewsStatus(this.itemValue).subscribe(
          (response: { success: number; }) => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'News Status has been Updated..',
              showConfirmButton: false,
              timer: 1500
            });
            this.getsyllabusList(this.organisationId);
            // this.showSuccess("Record added successfully");
            
            //console.log("success:",response.success);
          }
          }, (error: any) => {
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

  saveSyllabus() {
    //alert("Testing");
    this.syllabusDataArray=[];
    Swal.fire({
      title: 'Are you sure?',
      text: 'To Save This Record!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        if((this.files) && (this.teacherSyllabusFormGroup.value.syllabusDescription) && (this.teacherSyllabusFormGroup.value.course_id)){
          const formData= new FormData();
          formData.append("image",this.files, this.files.name);
          formData.append("courseId",this.teacherSyllabusFormGroup.value.course_id);
          formData.append("organisationId",this.teacherSyllabusFormGroup.value.organisationId);
          formData.append("syllabusDescription",this.teacherSyllabusFormGroup.value.syllabusDescription);
          //this.syllabusObject=formData;
          this.courseService.syllabusUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log(this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Syllabus has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getsyllabusList(this.organisationId);
              this.teacherSyllabusFormGroup = new FormGroup({
                syllabusDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId)
              })
            }
          })
        }else if((this.files) && (this.teacherSyllabusFormGroup.value.syllabusDescription)){
          const formData= new FormData();
          formData.append("image",this.files, this.files.name);
          formData.append("organisationId",this.teacherSyllabusFormGroup.value.organisationId);
          formData.append("syllabusDescription",this.teacherSyllabusFormGroup.value.syllabusDescription);
          this.courseService.syllabusUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log(this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Syllabus has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getsyllabusList(this.organisationId);
              this.teacherSyllabusFormGroup = new FormGroup({
                syllabusDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId)
              })
            }
          })
        }else if(this.teacherSyllabusFormGroup.value.course_id){
          const formData= new FormData();
          formData.append("courseId",this.teacherSyllabusFormGroup.value.course_id);
          formData.append("organisationId",this.teacherSyllabusFormGroup.value.organisationId);
          formData.append("syllabusDescription",this.teacherSyllabusFormGroup.value.syllabusDescription);
          this.courseService.syllabusUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log(this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Syllabus has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getsyllabusList(this.organisationId);
              this.teacherSyllabusFormGroup = new FormGroup({
                syllabusDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId)
              })
            }
          })
        }
        else{
          const formData= new FormData();
          formData.append("organisationId",this.teacherSyllabusFormGroup.value.organisationId);
          formData.append("syllabusDescription",this.teacherSyllabusFormGroup.value.syllabusDescription);
          this.courseService.syllabusUploadSave(formData).subscribe(response=>{
            this.data=response;
            console.log(this.data);
            this.syllabusObject=this.data;
            if (this.data.success === 1) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Syllabus has been saved',
                showConfirmButton: false,
                timer: 1500
              });
             
              this.getsyllabusList(this.organisationId);
              this.teacherSyllabusFormGroup = new FormGroup({
                syllabusDescription: new FormControl(null, [Validators.required]),
                course_id: new FormControl(null),
                image: new FormControl(null),
                organisationId:new FormControl(this.organisationId)
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
  getsyllabusList($orgID: any) {
    this.reportService.fetchSyllabusListReport($orgID).subscribe(response => {
      this.syllabusDataArray = response.data;
      console.log("getsyllabusList:", this.syllabusDataArray);
    })
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  clear(table: Table) {
    table.clear();
  } 
}

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {CommonService} from "../services/common.service";
import { faCoffee,faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { OrganisationService } from 'src/app/services/organisation.service';
import { StudentService } from 'src/app/services/student.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  faSignInAlt = faSignInAlt;
  faSignOutAlt=faSignOutAlt;
  stateList:any[]=[];
  organisationArray:any[]=[];
  profileImageArray:any[]=[];
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter<any>();
  defaultPicture: string = "";
  imageSrc: string | ArrayBuffer | null ="";
  file: File | undefined;
  organisationId:number=0;
  UserID:number=0;
  ledgerId:number=0;
  files:any;
  isShowProfile:boolean=false;
  constructor(public authService: AuthService, public commonService: CommonService,
    private studentService: StudentService,
    private organisationService: OrganisationService) {
      const user = localStorage.getItem('user');
      if (user){
        const localUserID = JSON.parse(<string>user).uniqueId;
       /*  const organizationID = JSON.parse(<string>user).organisationId;
        console.log("organizationID:",organizationID); */
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        this.ledgerId = JSON.parse(<string>user).ledgerId;
        console.log("user localUserID:",(this.UserID));
        console.log("user organisationId:",(this.organisationId));
        console.log("Ledger id:",(this.ledgerId));

        this.getProfileImageById(this.organisationId,this.ledgerId);
       this.isShowProfile=true;
        //this.imageSrc = this.commonService.getPublic() + '/profile_pic/profile_pic_' + localUserID + '.jpeg';
       
      }
      
  
  }
  teacherEbookPaperFormGroup!: FormGroup;
  ngOnInit(): void {
    this.teacherEbookPaperFormGroup = new FormGroup({
      organisationId:new FormControl(this.organisationId),
      ledgerId:new FormControl(this.ledgerId)
    })
    //this.defaultPicture = this.commonService.getPublic() + '/profile_pic/no_dp.png';

    /* const user = localStorage.getItem('user');
      if (user){
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        this.ledgerId = JSON.parse(<string>user).ledgerId;
        console.log("user localUserID:",(this.UserID));
        console.log("user organisationId:",(this.organisationId));
        console.log("Ledger id:",(this.ledgerId));
      } */

   
    //this will work at the time of user change
    this.authService.getUserBehaviorSubjectListener().subscribe(response => {
      const user = response;
      if (user){
        const localUserID = user.uniqueId;
       /* const organizationID = user.organisationId;
        console.log("organizationID:",organizationID); */
        this.imageSrc = this.commonService.getPublic() + '/profile_pic/profile_pic_' + localUserID + '.jpeg';
      }
    });
    this.getStateList();
    this.getAllOrganisation();

  }
  getStateList() {
    this.studentService.fetchAllStates().subscribe(response => {
      this.stateList = response.data;
      console.log("stateList:", this.stateList);
    })
  }
  getAllOrganisation(){
    this.organisationService.fetchAllOrganisation().subscribe(response => {
      this.organisationArray = response.data;
      console.log("organisationArray:", this.organisationArray);
    })
  }
  getProfileImageById($orgID:any,$ledgerID:any){
    this.authService.fetchProfileImage($orgID,$ledgerID).subscribe(response => {
      this.profileImageArray = response.data;
      console.log("Profile Images:", this.profileImageArray);
      if(this.profileImageArray[0].id>0){
        
        const imageName=this.profileImageArray[0].image_url;
        this.imageSrc = this.commonService.getPublic() + '/profile_pic/'+imageName;
      }else{
        this.defaultPicture = this.commonService.getPublic() + '/profile_pic/no_dp.png';
      }
    })
  }
  toggleSlidebar(choice=true){
    this.toggleSidebarForMe.emit({choice: choice});
  }

  logOutCurrentUser() {
    this.authService.logout();
  }
  logOutFromAll() {
    this.authService.logoutAll();
  }

  onChange(event: any){
    this.files = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e => this.imageSrc = reader.result);
    // @ts-ignore
    reader.readAsDataURL(this.files);
    /* const ledgerId=this.teacherEbookPaperFormGroup.value.ledgerId;
    const organisationId=this.teacherEbookPaperFormGroup.value.organisationId;
    console.log("ledgerId:",ledgerId);
    console.log("organisationId:",organisationId); */
    const formData= new FormData();
    formData.append('file', this.files);
    formData.append("filename",this.files,this.files.name);
    formData.append("ledgerId",this.teacherEbookPaperFormGroup.value.ledgerId);
    formData.append("organisationId",this.teacherEbookPaperFormGroup.value.organisationId);
    //console.log("login data:",formData);
     this.authService.upload(formData).subscribe((response) => {
        console.log(response);
        if (response.success === 1){
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your Profile Image Saved..',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    ); 
    event.srcElement.value = null;
  }


}

import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { CustomerService } from 'src/app/services/customer.service';
@Component({
  selector: 'app-item-to-service',
  templateUrl: './item-to-service.component.html',
  styleUrls: ['./item-to-service.component.scss']
})
export class ItemToServiceComponent implements OnInit {

  itemToServceFormGroup!: FormGroup;
  stateList: any[] = [];
  organisationList: any[] = [];
  studentList:any[]=[];
  ItemList:any[]=[];
  workTypeList:any[]=[];
  itemToServiceList:any[]=[];
  showDiv:boolean=false;
  isShown:boolean=false;
  showDivStudentExists:boolean=false;
  organisationName: string = '';
  address: string = '';
  city: string = '';
  contactNumber: string = '';
  itemName:any;
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
    itemToServiceId?:any;
    workTypeId?: any;
    itemId?: any;
    description?: string;
    organisationId?: number;
  } = {};
  constructor(private customerService: CustomerService,
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
       this.getAllItem(this.organisationId);
       this.getAllItemToService(this.organisationId);
       this.getAllWorkTypes(this.organisationId);
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
  onUpdate(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Update This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if(result.isConfirmed) {
        this.studentData.itemToServiceId = this.itemToServceFormGroup.value.itemToServiceId;
        this.studentData.workTypeId = this.itemToServceFormGroup.value.workTypeId;
        this.studentData.itemId = this.itemToServceFormGroup.value.itemId;
        this.studentData.description = this.itemToServceFormGroup.value.description;
        this.studentData.organisationId = this.organisationId;

        this.customerService.updateItemToService(this.studentData).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Item To Services has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.onClear();
            console.log("Return Customer data:", response.data);
            this.selectedIndex=0;
            this.getAllItemToService(this.organisationId);
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
  editItem(ItemData:any){
    console.log("ItemToService Details:",ItemData);
    this.selectedIndex = 1;
    this.isShown=true;
    this.itemToServceFormGroup.patchValue({ itemToServiceId: ItemData.id });
    this.itemToServceFormGroup.patchValue({ itemId: ItemData.item_id });
    this.itemToServceFormGroup.patchValue({ workTypeId: ItemData.work_type_id});
    this.itemToServceFormGroup.patchValue({ description: ItemData.item_to_service_description });
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
    this.itemToServceFormGroup = new FormGroup({
      workTypeId: new FormControl(null,[Validators.required]),
      itemId: new FormControl(null,[Validators.required]),
      description: new FormControl(null),
      itemToServiceId: new FormControl(0)
    })
  }
 getStateList(){
    this.customerService.fetchAllStates().subscribe(response => {
      this.stateList=response.data;
      console.log("stateList:",this.stateList);
    })
  } 
  getOrganisationList(){
    this.organisationList=[];
    this.customerService.fetchAllOrganisaction().subscribe(response => {
      this.organisationList=response.data;
      console.log("organisationList:",this.organisationList);
    })
  } 
  getAllItem($orgID:any){
    this.customerService.fetchAllItem(this.organisationId).subscribe(response => {
      this.ItemList = response.data;
      console.log("ItemList list:", this.ItemList);
    })
  }
  getAllItemToService($orgID:any){
    this.customerService.fetchAllItemToService(this.organisationId).subscribe(response => {
      this.itemToServiceList = response.data;
      console.log("ItemList list:", this.ItemList);
    })
  }
  getAllWorkTypes($orgID:any){
    this.customerService.fetchAllWorkType(this.organisationId).subscribe(response => {
      this.workTypeList = response.data;
      console.log("Work list:", this.workTypeList);
    })
  }
  onClear(){
    this.isShown=false;
    this.itemToServceFormGroup = new FormGroup({
      workTypeId: new FormControl(null,[Validators.required]),
      itemId: new FormControl(null,[Validators.required]),
      description: new FormControl(null),
      itemToServiceId: new FormControl(0)
    })
  }
  onSave() {
    //console.log("jhjkhj");
    Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if(result.isConfirmed) {
        this.studentData.workTypeId = this.itemToServceFormGroup.value.workTypeId;
        this.studentData.itemId = this.itemToServceFormGroup.value.itemId;
        this.studentData.description = this.itemToServceFormGroup.value.description;
        this.studentData.organisationId = this.organisationId;

        this.customerService.saveItemToService(this.studentData).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Item To Services has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.onClear();
            console.log("Return Customer data:", response.data);
            this.selectedIndex=0;
            this.getAllItemToService(this.organisationId);
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
    //this.emailMobileNoCheck= this.itemToServceFormGroup.get('emailMobileNoCheck')?.value;
    console.log("test:",$data.target.value);
    let emailOrMobile=$data.target.value;
    this.customerService.fetchCheckStudentExists(emailOrMobile).subscribe(response => {
      this.studentList=response.data;
      this.successMessage=response.success;
      if(this.successMessage>0){
        this.showDivStudentExists=true;
        this.itemName = this.studentList[0].ledger_name;
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
    this.itemToServceFormGroup.patchValue({ contactNumber: this.itemToServceFormGroup.value.whatsappNumber });

  }
  setDOBSQL(value: string) {
    this.itemToServceFormGroup.patchValue({ dob: this.commonService.getSQLDate(value) });
  }


}

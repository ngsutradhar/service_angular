import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { OrganisationService } from 'src/app/services/organisation.service';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent implements OnInit {
  stateList:any[]=[];
  organisationArray:any[]=[];
  hiddenInput:boolean=false;
  isBtnVisible:boolean=false;
  organisationFormGroup!: FormGroup;
  constructor(private route: ActivatedRoute,
    private studentService: StudentService,
    private organisationService: OrganisationService
    ) { }

  ngOnInit(): void {
     this.organisationFormGroup = new FormGroup({
      organisationId: new FormControl(0,[Validators.required]),
      stateId: new FormControl(20),
      organisationName: new FormControl(null,[Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      address: new FormControl(null,[Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      city: new FormControl(null),
      district: new FormControl(null),
      pin: new FormControl(null),
      contactNumber: new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      whatsappNumber: new FormControl(null),
      emailId: new FormControl(null,[Validators.required, Validators.email]),
      openingBalance: new FormControl(0),
      
    });
    this.getStateList();
    this.getAllOrganisation();
  }
  active = 0;
  selectedIndex = 0
  onTabChanged(event: any) {
    console.log(event)
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
  getEventValue($event: any): string {
    return $event.target.value;
  }
  clear(table: Table) {
    table.clear();
  }
  onSave(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.organisationService.saveOrganisation(this.organisationFormGroup.value).subscribe(response => {
          //this.showError = response.exception;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Organisation has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllOrganisation();
            this.onClear();
            // this.showSuccess("Record added successfully");
          
          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Entry ..!!',
            text: error,
            footer: '<a href>Why do I have this issue?</a>' ,
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
  onUpdate(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Update This Record...!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.organisationService.updateOrganisation(this.organisationFormGroup.value).subscribe(response => {
          //this.showError = response.exception;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Organisation has been Update',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllOrganisation();
            this.onClear();
            // this.showSuccess("Record added successfully");
          
          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Entry ..!!',
            text: error,
            footer: '<a href>Why do I have this issue?</a>' ,
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
  onClear(){
    this.isBtnVisible=false;
    this.organisationFormGroup = new FormGroup({
      organisationId: new FormControl(0,[Validators.required]),
      stateId: new FormControl(20),
      organisationName: new FormControl(null,[Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      address: new FormControl(null,[Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      city: new FormControl(null),
      district: new FormControl(null),
      pin: new FormControl(null),
      contactNumber: new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      whatsappNumber: new FormControl(null),
      emailId: new FormControl(null,[Validators.required, Validators.email]),
      openingBalance: new FormControl(0),
      /* studentName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      billingName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]) */
    });
  }
  onEditOrganisation(orgData:any){
    console.log("orgData:",orgData);
    this.selectedIndex = 0;
    this.isBtnVisible=true;
    this.organisationFormGroup.patchValue({ organisationId: orgData.id });
    this.organisationFormGroup.patchValue({ stateId: orgData.state_id });
    this.organisationFormGroup.patchValue({ organisationName: orgData.organisation_name });
    this.organisationFormGroup.patchValue({ address: orgData.address });
    this.organisationFormGroup.patchValue({ city: orgData.city });
    this.organisationFormGroup.patchValue({ district: orgData.district });
    this.organisationFormGroup.patchValue({ pin: orgData.pin });
    this.organisationFormGroup.patchValue({ contactNumber: orgData.contact_number });
    this.organisationFormGroup.patchValue({ whatsappNumber: orgData.whatsapp_number });
    this.organisationFormGroup.patchValue({ emailId: orgData.email_id });
    this.organisationFormGroup.patchValue({ openingBalance: orgData.opening_balance });
  }
}


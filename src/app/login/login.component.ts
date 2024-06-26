import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Md5 } from "ts-md5";
import { Router } from "@angular/router";
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  dateDifference: number = 0;
  private loginableStudents: any[] = [];
  constructor(private fb: UntypedFormBuilder, private authService: AuthService, private router: Router, private reportService: ReportService) { }
  hide: boolean = true;
  ngOnInit(): void {
    this.authService.fetchStudents().then(students => {
      this.loginableStudents = students;
    });

    this.loginForm = new UntypedFormGroup({
      loginId: new UntypedFormControl('', [Validators.required, Validators.email]),
      loginPassword: new UntypedFormControl('', [Validators.required, Validators.minLength(6)])
    })
    //this.getWorkingDays();
  }
  login() {
    if (!this.loginForm.valid) {
      // return;
    }

    // var result = this.loginableStudents.find(obj => {
    //   return (obj.userName === this.loginForm.value.loginId && obj.password === this.loginForm.value.loginPassword);
    // })
    // if(result){
    //   this.authService.loginTutorial(result);
    //   this.router.navigate(['/tutorial']).then(r => {});
    // }

    //  ********* Local Login *****************************

    // ****************************************************
    // console.log(this.loginForm.value);
    // converting password to MD5
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(this.loginForm.value.loginPassword).end();
    // const formPassword = form.value.password;
    this.authService.login({ loginId: this.loginForm.value.loginId, loginPassword: passwordMd5 }).subscribe(response => {
     /*  if (this.dateDifference != 0) { */
        if (response.status === true) {
          if (this.authService.isOwner()) {
            this.router.navigate(['/owner']).then(r => { });
            //window.location.reload();
          }
          if (this.authService.isDeveloper()) {
            this.router.navigate(['/developer']).then(r => { });
            //window.location.reload();
          }
          if (this.authService.isStudent()) {
            this.router.navigate(['/StudentUser']).then(r => { });
            //window.location.reload();
          }
          if (this.authService.isOfficeStaff()) {
            this.router.navigate(['/TeacherDashboard']).then(r => { });
            //window.location.reload();
          }
          
        }else{
          console.log(response.message);
          alert(response.message);
        }
      /* }else{
        alert("Sorry!!! Your Date is Expire");
      } */
    });


  }
 /*  getWorkingDays() {
    this.reportService.fetchWorkingDaysReport().subscribe(response => {
      //this.workingEndDate = response.data[0].end_date;
      //this.workingDescription = response.data[0].description;
      this.dateDifference = response.data[0].date_difference;
      if (this.dateDifference <= 3) {
        //this.showMessage=true;
      } else {
        //this.showMessage=false;
      }
      console.log("dateDifference Days:", this.dateDifference);
    })
  } */

}

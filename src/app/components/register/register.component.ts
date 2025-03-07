import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormControlOptions } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/shared/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent {
  constructor(private _FormBuilder: FormBuilder, private _RegisterService: RegisterService, private _Router: Router) { }

  accountExist: boolean = false
  spinner: boolean = false
  doneRegister: boolean = false

  regForm: FormGroup = this._FormBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z0-9]{6,}$/),]],
    rePassword: [null] ,
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/),]],
  } ,   {validators : [this.checkRePassword]} as FormControlOptions )// HERE !!!!


  // custom validatior : rePass = pass 
  checkRePassword(myForm:FormGroup){
    let pass = myForm.get('password')
    let rePass = myForm.get('rePassword')

    if (rePass?.value == '') {
      rePass.setErrors({required:true})
    }
    else if (pass?.value != rePass?.value) {
      rePass?.setErrors({mismatch : true})
    }

  }

  submitReg() {
    if (this.regForm.valid) {
      this.spinner = true
      this._RegisterService.setRegister(this.regForm.value).subscribe({

        next: (response) => {
          this.spinner = false;
          console.log(response, 'done');
          this.accountExist = false;

          if (response.message == "success") {
            this.doneRegister = true
            setTimeout(
              () => { this._Router.navigate(['login']) }, 2000
            )

          }
        },


        error: (response) => {
          this.spinner = false;
          this.doneRegister = false
          console.log(response, 'error');
          this.accountExist = true;
        },


      })

    }

  }



}

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { registerDTO } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { Route, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  errorMessage:string=""
  
  registerFrm = new FormGroup({

    nome: new FormControl("",[

      Validators.required, 
      Validators.minLength(2), 
      Validators.pattern("^[A-Za-zÀ-ÖØ-öø-ÿ]+(\\s(([A-Za-zÀ-ÖØ-öø-ÿ]+|([A-Za-zÀ-ÖØ-öø-ÿ]\\.))*))*$")

    ]),

    cognome: new FormControl("",[

      Validators.required, 
      Validators.minLength(2),
      Validators.pattern("^[A-Za-zÀ-ÖØ-öø-ÿ]+(\\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*$")

    ]),
    
    email: new FormControl("", [
      
      Validators.required, 
      Validators.email

    ]),

    password: new FormControl("", [
      
      Validators.required,
      //manca pattern password
    
    ])
   
  })

  constructor(private as:AuthService, private ruter: Router){}

    register(){

      if (this.registerFrm.invalid) {
       
        this.registerFrm.markAllAsTouched(); 

      } else {

      const dto: registerDTO = {
        nome: this.registerFrm.get("nome")!.value!,
        cognome: this.registerFrm.get("cognome")?.value!,
        email: this.registerFrm.get("email")!.value!,
        password: this.registerFrm.get("password")!.value!
      }

      this.as.register(dto)
        .pipe(
          catchError((err: HttpErrorResponse) => {

            console.log(this.errorMessage = err.error);
            return of(undefined)

          })
        )

        .subscribe(user => {

          if(user){

            this.ruter.navigate(["/login"])

            console.log(user)

          }

        }
        )

      }

    }

}

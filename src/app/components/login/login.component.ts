import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { loginDTO } from '../../models/user';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new FormGroup({
    
    email: new FormControl("", [Validators.required,Validators.email]),
    password: new FormControl("", Validators.required),

  });

  errorMessage:string = "";
  

  constructor(private as:AuthService, private router: Router){}

  login(){
    this.as.login(this.loginForm.value as loginDTO)
     .pipe(
      catchError((err: HttpErrorResponse) => {
        this.errorMessage = "Email o password errati: " + err.error
        return of(undefined);
      })
     )
     .subscribe(user => {
      if(user){

        //NB il salvataggio dei dati dell'user nello storage l'ho posizionato nel service

        // Reindirizzamento alla dashboard personalizzata dell'utente
        const userId = user.user.id;
        this.router.navigate([`/personal-dashboard/${userId}`]);
      }
     })

  }
}

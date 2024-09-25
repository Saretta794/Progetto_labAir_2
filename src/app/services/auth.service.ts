import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggedUser, loginDTO, registerDTO } from '../models/user';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private router:Router) { }

  register(model: registerDTO): Observable<LoggedUser> {//nb in questo caso, ovvero con il Jason Server, mi torna anche con la registrazione un logged user, con altri server potrei avere una risposta completamente diversa

    return this.http.post<LoggedUser>(`${environment.JSON_SERVER_BASE_URL}/register`, model);

  }

  login(model: loginDTO): Observable<LoggedUser> {

    return this.http.post<LoggedUser>(`${environment.JSON_SERVER_BASE_URL}/login`, model)
      .pipe(
        tap(user => { 
          this.setLoggedUser(user)

          //creazione URL personalizzato per l'utente
          const userID = user.user.id;
          this.router.navigate([`/personal-dashboard/${userID}`]);

          })
      );

  }

  //salvataggio info utente loggato nel local storage
  setLoggedUser(user: LoggedUser){

    localStorage.setItem("user", JSON.stringify(user)); 

  }

  //per utilizzo info utente loggato salvate nel local storage
  getLoggedUser(): LoggedUser | null { 

    const loggedUser = localStorage.getItem("user");

    if(loggedUser){
      
      return JSON.parse(loggedUser) as LoggedUser;

    }

    return null; 

  }

  isLoggedIn(): boolean {
    return this.getLoggedUser() !== null;
  }

  logout(){
    localStorage.removeItem("user");
  }

}

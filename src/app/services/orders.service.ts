import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ordine } from '../models/orders';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient, private as:AuthService) { }

  saveOrder(order: Ordine): Observable<Ordine> {

    return this.http.post<Ordine>(`${environment.JSON_SERVER_BASE_URL}/orders`, order)

  }

  getOrders(id:string): Observable<Ordine[]>{

    const httpOptions = {

      headers: new HttpHeaders({
        
        Authorization: "Bearer" + this.as.getLoggedUser()!.accessToken

      })
      
    }

    return this.http.get<Ordine[]>(`${environment.JSON_SERVER_BASE_URL}/orders?loggedUserID=${id}`, httpOptions)
    
  }
}

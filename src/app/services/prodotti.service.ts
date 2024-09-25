import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prodotto } from '../models/prodotti';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProdottiService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Prodotto[]>{

    return this.http.get<Prodotto[]>(`${environment.JSON_SERVER_BASE_URL}/prodotti`) 

  }

  getBestSeller(): Observable<Prodotto[]>{

    return this.http.get<Prodotto[]>(`${environment.JSON_SERVER_BASE_URL}/prodotti?best_seller_gte=4`)

  }

  getNuoviArrivi(): Observable<Prodotto[]>{

    return this.http.get<Prodotto[]>(`${environment.JSON_SERVER_BASE_URL}/prodotti?nuovo_arrivo=true`)
    
  }

  getProdottoById(id:number): Observable<Prodotto>{
    
    return this.http.get<Prodotto>(`${environment.JSON_SERVER_BASE_URL}/prodotti/${id}`)
  }

  getProdottoByCategory(category:string):Observable<Prodotto[]>{

    return this.http.get<Prodotto[]>(`${environment.JSON_SERVER_BASE_URL}/prodotti?categoria=${category}`)

  }

  getTrend(): Observable<Prodotto[]>{

    return this.http.get<Prodotto[]>(`${environment.JSON_SERVER_BASE_URL}/prodotti?trend=true`)

  }

}

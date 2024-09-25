import { Component, OnInit } from '@angular/core';
import { Prodotto } from '../../models/prodotti';
import { ProdottiService } from '../../services/prodotti.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-nuovi-arrivi',
  templateUrl: './nuovi-arrivi.component.html',
  styleUrl: './nuovi-arrivi.component.css'
})
export class NuoviArriviComponent implements OnInit{

  products:Prodotto[] = []

  errorMessage:string=""

  constructor(private ps:ProdottiService){}

  ngOnInit(): void {
    
    this.ps.getNuoviArrivi()

      .pipe(
        
        catchError((err: HttpErrorResponse) => {

        this.errorMessage="Errore durante il caricamento dei Nuovi Arrivi: " + err.message

        return of(undefined)
        
      })
    
      )

      .subscribe(dati => {

        if(dati){ this.products = dati}
       
      })
  }
}

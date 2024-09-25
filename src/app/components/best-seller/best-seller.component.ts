import { Component, OnInit } from '@angular/core';
import { Prodotto } from '../../models/prodotti';
import { ProdottiService } from '../../services/prodotti.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrl: './best-seller.component.css'
})
export class BestSellerComponent implements OnInit{

  products:Prodotto[] = []

  errorMessage:string=""

  constructor(private ps:ProdottiService){}

  ngOnInit(): void {
    
    this.ps.getBestSeller()

    .pipe(

      catchError((err:HttpErrorResponse) => {

        this.errorMessage="Errore durante il caricamento dei Best Seller: " + err.message

        return of(undefined)

      })
    )
      .subscribe(data => {

        if(data){ this.products = data }

      })
  }
}

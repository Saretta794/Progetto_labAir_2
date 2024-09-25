import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProdottoCart } from '../../models/prodotti';
import { NgFor } from '@angular/common';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent implements OnInit {

  cartProducts: ProdottoCart[] = []

  errorMessage:string=""

  //metodo getter per leggere le variabili subtotal, shippingCost, total
  get subtotal(): number {

    return this.cs.subtotal;

  }
  
  get shippingCost(): number {

    return this.cs.shippingCost;

  }
  
  get total(): number {

    return this.cs.total;

  }

  constructor(public cs:CartService){}

  ngOnInit(): void {
    
    this.loadingCart()

  }

  loadingCart():void{ 
  
    this.cs.getCart()

      .pipe(

        catchError((err:HttpErrorResponse) => {

          this.errorMessage = "Errore durante il caricamento del carrello: " + err.message

          return of(undefined)

        })
      )
      .subscribe(dati => {

        if(dati){
  
        this.cartProducts = dati;

        this.cs.calculateTotals();

      }

    })

  }


  updateQuantity(cp: ProdottoCart): void {

    if (cp.num_pezzi <= 5) {

      cp.prezzo_totale = cp.prezzo_unitario * cp.num_pezzi;

      this.cs.changeProductCart(cp)

      .pipe(

        catchError((err:HttpErrorResponse) => {

          this.errorMessage = "Errore durante la modifica del carrello: " + err.message

          return of(undefined)

        })
      )
      
      .subscribe(changedCartItem => {

        this.cs.calculateTotals();

        // console.log('Quantità del carrello aggiornata:', changedCartItem);

        // console.log(this.shippingCost)

      });
    } else {
      alert('Non puoi acquistare più di 5 pezzi nello stesso ordine!');
    }
  }

  deleteProduct(id:number):void{

    this.cs.removeFromCart(id)

    .pipe(

      catchError((err:HttpErrorResponse) => {

        this.errorMessage = "Impossibile eliminare il prodotto dal carrello. Errore: " + err.message

        return of(undefined)
      })
    )
    
      .subscribe( () => {this.loadingCart()} 

    )
  }
 
}

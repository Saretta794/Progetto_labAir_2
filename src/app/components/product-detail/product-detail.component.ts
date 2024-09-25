import { Component, OnInit } from '@angular/core';
import { Prodotto, ProdottoCart } from '../../models/prodotti';
import { ProdottiService } from '../../services/prodotti.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit{

  product?: Prodotto 

  errorMessage:string=""

  selectedSize:number = 0
  selectedColor:string=""

  cartProducts:ProdottoCart[]=[]
  elementoTrovato?:ProdottoCart

  showPopup:boolean=false
  showRedBorderSize: boolean = false; 
  showRedBorderColor: boolean = false; 

  constructor(private ps:ProdottiService, private route:ActivatedRoute, private cs:CartService){}

  ngOnInit(): void {
    
    const id = this.route.snapshot.paramMap.get("id");

    if(id && !isNaN(+id)){//condizione per gestire il caso che l'id sia nullo o non valido

    this.ps.getProdottoById(+id!)

    .pipe(

      catchError((err:HttpErrorResponse) => {

        this.errorMessage="Errore durante il caricamento della pagina del prodotto: " + err.message

        return of(undefined)

      })
    )

      .subscribe(dati => {

        if(dati){this.product = dati}

      });

    } else { this.errorMessage="ID del prodotto non valido" }
  }

  addToCart():void{

    if(this.selectedColor && this.selectedSize){

      this.cs.getCart()

      .pipe(
        
        catchError((err:HttpErrorResponse) => {

          this.errorMessage = "Impossibile aggiungere al carrello. Errore: " + err.message

          return of([])
        
      })
      )
      .subscribe(dati => {

        if(dati){

          this.cartProducts = dati;
        
        }
  

      this.elementoTrovato = this.cartProducts.find(elemento =>
        elemento.id_prodotto===this.product?.id && 
        elemento.colore === this.selectedColor && 
        elemento.taglia === +this.selectedSize)//HO DOVUTO RITRASFORMARE LA TAGLIA SELEZIONATA IN NUMERO PERCHè LO LEGGEVA COME STRINGA RIPRENDENDOLA DALL'HTML (altrimenti elementoTrovato risulta sempre undefined perchè i tipi nel confronto non coincidono)

    //  console.log(this.elementoTrovato)

    if(this.elementoTrovato != undefined){ //se viene trovato un elemento con le stesse caratteristiche di quello che l'utente vuole aggiungere al carrello

      if(this.elementoTrovato.num_pezzi<5){ //se di quell'elemento non sono già presenti 5 pezzi

      //vene modificato l'elemento già presente
      this.elementoTrovato.num_pezzi++; 
      this.elementoTrovato.prezzo_totale= this.product!.prezzo * this.elementoTrovato.num_pezzi

      this.cs.changeProductCart(this.elementoTrovato)
        
      .pipe(
        
        catchError((err:HttpErrorResponse) => {

          this.errorMessage = "Impossibile aggiungere al carrello. Errore: " + err.message

          return of(undefined)
        
      })
      )
      .subscribe(changedCartItem => {

        if (changedCartItem) { 

          console.log("Elemento nel carrello aggiornato:", changedCartItem);

          this.showNotificationPopup();

        }

      });

        } else{

        alert("non puoi aquistare più di 5 pezzi nello stesso ordine!")
      }

    } else { //se non viene trovato un elemento con le stesse caratteristiche di quello che vuole inserire l'utente, viene creato e aggiunto un nuovo elemento

      const productCart: ProdottoCart = {

        id_prodotto: this.product!.id,
        nome:this.product!.nome,
        categoria:this.product!.categoria,
        prezzo_unitario:this.product!.prezzo,
        prezzo_totale:this.product!.prezzo,
        taglia: +this.selectedSize,
        colore:this.selectedColor,
        immagine:this.product!.immagine,
        nuovo_arrivo: this.product!.nuovo_arrivo,
        best_seller: this.product!.best_seller,
        num_pezzi: 1,
        
      }

      // console.log(productCart)

      this.cs.addToCart(productCart)

      .pipe(
        
        catchError((err:HttpErrorResponse) => {

          this.errorMessage = "Impossibile aggiungere al carrello. Errore: " + err.message

          return of(undefined)
        
      })
      )
      
      
      .subscribe(result =>{

        // console.log("prodotto aggiunto", productCart) 

        if(result) {this.showNotificationPopup()}
  
      })

    }

  })

  }else{

    if(this.selectedSize === 0){this.showRedBorderSize = true}
    if(this.selectedColor === ""){this.showRedBorderColor = true}
    
  }

   }

   showNotificationPopup():void{

    this.showPopup= true;

    setTimeout(()=>{

      this.showPopup=false;
      
    }, 8000 );


   }

}

import { Component, OnInit } from '@angular/core';
import { Prodotto } from '../../models/prodotti';
import { ProdottiService } from '../../services/prodotti.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {

  products: Prodotto[]=[];
  filteredProducts:Prodotto[]=[];
  categories:string[]=[];
  colors:string[]=[];
  selectedParameter: string | null = null;
 
  lowPrice:number=50;
  midPrice:number=100;
  highPrice:number=150;

  errorMessage:string=""
  
  constructor(private ps: ProdottiService){}

  ngOnInit(): void {
    
    this.ps.getProducts()

      .pipe(

        catchError((err:HttpErrorResponse) => {

          this.errorMessage="Errore nel caricamento dei prodotti: " + err.message

          return of(undefined)

        })
      )
    
      .subscribe (dati => {

        if(dati){

          this.products = dati
          this.filteredProducts = this.products;
  
          this.extractCategories()
          this.extractColors()

        }
   
    })

  }
  
  extractCategories(){

    for(let p of this.products){

      if(!this.categories.includes(p.categoria)){

        this.categories.push(p.categoria);

      }
    }
  }

  extractColors(){

    for(let p of this.products){

      for(let c of p.colori_disponibili){
        if(!this.colors.includes(c)){
          
          this.colors.push(c);

        }
      }
    }
  }

  //CREAZIONE DEI FILTRI SUI PRODOTTI:
  //con il metodo filter, a partire da un array, ne creo un altro i cui elementi rispondono ad una condizione specifica
  //da implementare: creazione di filtri sovrapposti.

  filterByCategory(category: string): void {

    this.selectedParameter = category;
    this.filteredProducts = this.products.filter(p => p.categoria === category);

  }

  filterByColor(color: string): void {

    this.selectedParameter = color;
    this.filteredProducts = this.products.filter(p => p.colori_disponibili.includes(color));
  }

  filterByPrice(min:number, max?:number): void{

    if(max){

      this.filteredProducts = this.products.filter(p => p.prezzo >= min && p.prezzo < max)

      
    }else{

      this.filteredProducts = this.products.filter(p => p.prezzo >= min)

    }
  }
}

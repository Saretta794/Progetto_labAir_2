import { Component, OnInit } from '@angular/core';
import { Prodotto } from '../../models/prodotti';
import { ActivatedRoute } from '@angular/router';
import { ProdottiService } from '../../services/prodotti.service';
import { pipe, catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-name-filtered-products',
  templateUrl: './name-filtered-products.component.html',
  styleUrl: './name-filtered-products.component.css'
})
export class NameFilteredProductsComponent implements OnInit{

  searchResults: Prodotto[]=[];

  searchTerm:string="";

  errorMessage:string="";

  constructor(private route:ActivatedRoute, private ps: ProdottiService){}

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {

    this.searchTerm = params['search']; 

      if(this.searchResults) {

        this.ps.getProducts()

        .pipe(
         
          catchError((err: HttpErrorResponse) => {

            this.errorMessage="Errore durante il caricamento dei Nuovi Arrivi: " + err.message
    
            return of(undefined)
            
          })

        )

        .subscribe(products => {

          this.searchResults= products!.filter(product => product.nome.toLocaleLowerCase().includes(this.searchTerm))
        
        })
      }
    })
  }

}

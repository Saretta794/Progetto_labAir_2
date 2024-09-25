import { Component, OnInit } from '@angular/core';
import { Prodotto } from '../../models/prodotti';
import { ProdottiService } from '../../services/prodotti.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-products-by-category',
  templateUrl: './products-by-category.component.html',
  styleUrl: './products-by-category.component.css'
})
export class ProductsByCategoryComponent implements OnInit {


  products:Prodotto[]=[]
  category:string=""

  errorMessage:string=""


  constructor(private ps:ProdottiService, private route:ActivatedRoute){}

  ngOnInit(): void {

    this.route.params.subscribe(

      data => {

        this.category=data['cat']
        this.ps.getProdottoByCategory(this.category)

        .pipe(

          catchError((err:HttpErrorResponse) => {

            this.errorMessage="Errore nel caricamento dei prodotti: " + err.message;

            return of(undefined);

          })
        )
        
        .subscribe(data => {

          if(data){ this.products = data }
          
        })


      }
    )
  }


}

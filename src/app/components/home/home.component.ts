import { Component } from '@angular/core';
import { Image } from '../../models/img';
import { ProdottiService } from '../../services/prodotti.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Prodotto } from '../../models/prodotti';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  
  trendProdotti:Prodotto[]=[]

  errorMessage:string=""

  constructor( private ps:ProdottiService ){}


  ngOnInit(): void {
    
    this.ps.getTrend()

    .pipe(

      catchError((err:HttpErrorResponse) => {

        this.errorMessage="Errore durante il caricamento dei Trend: " + err.message

        return of(undefined)

      })
    )
      .subscribe(data => {

        if(data){ this.trendProdotti = data }

      })
  }

  categoryImg:Image[]=[
    
    { src: "/assets/images/categorie/sport_1.jpg", title: "Calcio", alt:"img"},
    { src: "/assets/images/categorie/sport_2.jpg", title: "Danza", alt:"img"},
    { src: "/assets/images/categorie/sport_3.jpg", title: "Basket", alt:"img"},
    { src: "/assets/images/categorie/sport_4.jpg", title: "Tennis", alt:"img"},
    { src: "/assets/images/categorie/sport_5.jpg", title: "Fitness", alt:"img"}
];

  membershipImg:Image[]=[
    { src: "/assets/images/community/banner_2.jpg", title: "Aquista", alt:"Aquista", title2:"Prodotti per i member", title3:"Accesso esclusivo su misura per te"},
    { src: "/assets/images/community/banner_5.jpg", title: "Celebra", alt:"Celebra",title2:"Ricompense per i memeber", title3:"Il nostro modo di ringraziarti"},
    { src: "/assets/images/community/banner_6.jpg", title: "Inizia a muoverti", alt:"Inizia a muoverti",title2:"Sport e benessere", title3:"Per fare movimento ovunque"},
    { src: "/assets/images/community/banner_1.jpg", title: "img", alt:"img"},
    { src: "/assets/images/community/banner_3.jpg", title: "img", alt:"img"}

  ]

}

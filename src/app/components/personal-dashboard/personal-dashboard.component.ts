import { Component, OnInit } from '@angular/core';
import { LoggedUser } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { OrdersService } from '../../services/orders.service';
import { Ordine } from '../../models/orders';
import { ProdottoCart } from '../../models/prodotti';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-personal-dashboard',
  templateUrl: './personal-dashboard.component.html',
  styleUrl: './personal-dashboard.component.css'
})
export class PersonalDashboardComponent implements OnInit {

  loggedUser: LoggedUser | null = null;

  userID: string | null = null;

  orders:Ordine[]=[];

  // Aggiungo una variabile per raggruppare i prodotti per ordine
  ordersWithProducts: { ordine: Ordine, prodotti: ProdottoCart[] }[] = [];

  errorMessage:string="";

  constructor(

    private as: AuthService, 
    private os:OrdersService, 
    private router:Router, 
    private route:ActivatedRoute // per estrarre l'ID dall'URL

  ){}

  ngOnInit(): void {
    
    //la verifica dell'utente loggato + l'eventuale reindirizzamento alla login sono nella GUARD

    //recupero i dati dell'utente loggato
    this.loggedUser=this.as.getLoggedUser();

    //console.log(this.loggedUser)

    const loggedUserID = JSON.stringify(this.loggedUser?.user.id)

    //Estraggo l'ID dell'utente dalla rotta
    this.userID = this.route.snapshot.paramMap.get('userID');

    // Se non trovo l'ID nell'URL, reindirizza alla login
    if (!this.userID || this.userID !== loggedUserID) {
      this.router.navigate(['/login']);
      alert("UserID non valido!");
      return;
    }

    //chiamo il servizio per ottenere gli ordini dell'utente
    this.os.getOrders(this.userID!) //DEVO METTERE IL CATCH ERROR!!

      .pipe(
        catchError((err: HttpErrorResponse) => {

          this.errorMessage= 'Errore nel recuero deglio ordini:' + err.error;

          return of(undefined)

        })
      )
      .subscribe(orders => {

        if(orders){ 

          this.orders = orders;

          // Raggruppa i prodotti per ogni ordine
          this.ordersWithProducts = orders.map(ordine => ({
            ordine: ordine,
            prodotti: ordine.prodotti

        
      }))
    }})


    
  }

}

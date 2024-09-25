import { Component, OnInit } from '@angular/core';
import { Prodotto } from '../../models/prodotti';
import { ProdottiService } from '../../services/prodotti.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  //VARIABILI
  isMenuCollapsed = true;
  isLoggedIn: boolean = false;
  loggedUserID: string | null = null;
  topMenuElements: Array<{ title: string, path: string, isVisible: () => boolean }> = [];

  //variabili per estrazione categorie
  products:Prodotto[]=[];
  categories:string[]=[];

  //variabile per barra di ricerca
  searchTerm:string="";

  allMenuElements = [
    {title:"Trova negozio", path:"", isVisible: () => true},
    {title:"Aiuto", path:"", isVisible: () => true},
    {title:"Unisciti a noi", path:"/register", isVisible: () => !this.isLoggedIn},
    {title:"Accedi", path:"/login", isVisible: () => !this.isLoggedIn},
    //logout e collegamento alla personal dashboard a parte, eventualmente da modificare 2 volte nel template
  ];
  
  slides = [ 
    { title: 'Iscriviti per avere sconti esclusivi!', path:"" },
    { title: 'Scopri i nostri Best seller!', path:"" },
    { title: 'Work in progress per la sezione outlet!', path:""}
  ];

  constructor(private ps:ProdottiService, private router: Router, private as:AuthService){}

  ngOnInit(): void {

    this.updateLoginStatus(); // Verifica lo stato di autenticazione all'inizio

    this.ps.getProducts()

      .subscribe(dati => {
        this.products = dati;
        this.extractCategories();
        
    });
  }


  extractCategories(){ //EVENTUALMENTE GESTIONE CON SET (da studiare)

    for(let p of this.products){

      if(!this.categories.includes(p.categoria)){

        this.categories.push(p.categoria)

      }
    }
  }

  onSearchChange(): void {

    const query = this.searchTerm.toLowerCase();
    this.router.navigate(['/name-filtered-products'], { queryParams: { search: query } });
    this.searchTerm = '';

  }

  updateLoginStatus() {

    this.isLoggedIn = this.as.isLoggedIn();

    if (this.isLoggedIn) {
      
      const user = this.as.getLoggedUser();
      this.loggedUserID= user!.user.id.toString();

    }

    this.updateMenuElements(); // Aggiorna gli elementi del menu ogni volta che cambia lo stato di login
  
  }

  updateMenuElements(){// Filtro gli elementi basandomi sulla visibilità

      this.topMenuElements = this.allMenuElements.filter(item => item.isVisible());

  }



  logout() {

    this.as.logout(); // Chiama il metodo logout dal servizio AuthService
    this.router.navigate(['/login']); // Reindirizza l'utente alla pagina di login
    this.updateLoginStatus(); // Aggiorna lo stato di login e del menu
    
  }

}
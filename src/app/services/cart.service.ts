import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Prodotto, ProdottoCart } from '../models/prodotti';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartStorageKey:string="cartProducts"

  constructor(private http:HttpClient, private as:AuthService) { }

    
  // Proprietà per i totali
  subtotal: number = 0;
  shippingCost: number = 0;
  total: number = 0;


  // Metodo per calcolare i totali
    calculateTotals(): void {

    const cartProducts = this.getCartFromLocalStorage();
    
    this.subtotal = 0;
    this.shippingCost = 0;
    this.total = 0;
  
    // Ciclo for per sommare i prezzi totali
    for (let item of cartProducts) {

      this.subtotal += item.prezzo_totale;

    }
  
    // Determina il costo di spedizione
    this.shippingCost = this.subtotal < 300 ? 4.90 : 0;
    this.shippingCost = this.as.isLoggedIn() ? 0 : (this.subtotal < 300 ? 4.90 : 0);

    // Calcola il totale
    this.total = this.subtotal + this.shippingCost;

  }

  // Per ottenere i totali...
  getSubtotal(): number {

    return this.subtotal;

  }

  getShippingCost(): number {

    return this.shippingCost;

  }

  getTotal(): number {

    return this.total;

  }


  // Recupera i prodotti del carrello dal JSON Server
  getCart(): Observable<ProdottoCart[]> {

    return this.http.get<ProdottoCart[]>(`${environment.JSON_SERVER_BASE_URL}/cart`)

      .pipe(

        tap(products => {

          this.setCartProduct(products)// Aggiorna il localStorage con i prodotti recuperati dal server
          this.calculateTotals();  // **Aggiorna i totali**

      })
    );
  }

  // Aggiunge un prodotto al carrello sul server e aggiorna anche il localStorage
  addToCart(productCart: ProdottoCart): Observable<ProdottoCart> {

    return this.http.post<ProdottoCart>(`${environment.JSON_SERVER_BASE_URL}/cart`, productCart)

      .pipe(

        tap(() => {

          const currentCart = this.getCartFromLocalStorage();
          currentCart.push(productCart);
          this.setCartProduct(currentCart);  // Aggiorna il localStorage
          this.calculateTotals();  // **Aggiorna i totali**

        })
      );
  }

  // Rimuove un prodotto dal carrello sul server e aggiorna il localStorage
  changeProductCart(cartItem: ProdottoCart):Observable<ProdottoCart>{

    return this.http.patch<ProdottoCart>(`${environment.JSON_SERVER_BASE_URL}/cart/${cartItem.id}`, cartItem)

    .pipe(

      tap(() => {

        let currentCart = this.getCartFromLocalStorage();
        currentCart = currentCart.map(item => item.id === cartItem.id ? cartItem : item);
        this.setCartProduct(currentCart);  // Aggiorna il localStorage
        this.calculateTotals();  // **Aggiorna i totali**

      })
    );
  
  }

  removeFromCart(id: number): Observable<ProdottoCart> {

    return this.http.delete<ProdottoCart>(`${environment.JSON_SERVER_BASE_URL}/cart/${id}`)

      .pipe(

      tap(() => {

        let currentCart = this.getCartFromLocalStorage();
        currentCart = currentCart.filter(item => item.id !== id);
        this.setCartProduct(currentCart);  // Aggiorna il localStorage
        this.calculateTotals();  // **Aggiorna i totali**

      })
    );
  }

  // Salva i prodotti del carrello nel localStorage
  setCartProduct(cartProducts: ProdottoCart[]): void{

    localStorage.setItem(this.cartStorageKey, JSON.stringify(cartProducts)); 

  }

  // Recupera i prodotti del carrello dal localStorage
  getCartFromLocalStorage(): ProdottoCart[] {

    const cart = localStorage.getItem(this.cartStorageKey);
    return cart ? JSON.parse(cart) : [];

  }
    
  // Svuota il carrello nel localStorage
  clearCart(): void {

    localStorage.removeItem(this.cartStorageKey);
    this.calculateTotals();  // **Aggiorna i totali**

  }

  //svuotare il carrello
  clearCartOnServer(): Observable<void> {

    // return this.http.delete<void>(`${environment.JSON_SERVER_BASE_URL}/cart`); con json server non posso...
    return this.getCart().pipe(

      map(products => products.map(product => product.id!)),

      switchMap(ids => {

        const deleteRequests = ids.map(id => this.removeFromCart(id));
        return forkJoin(deleteRequests);

      }),

      map(() => {
        
        this.calculateTotals();  // **Aggiorna i totali**
        void 0

      }),

      catchError((err) => {

        console.error('Errore durante la rimozione dei prodotti dal server:', err);
        return of(undefined); // Gestisce l'errore

      })
    );
  }


}

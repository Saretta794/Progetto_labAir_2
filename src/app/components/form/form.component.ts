import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { DatiPagamento, DatiSpedizione, Ordine } from '../../models/orders';
import { ProdottoCart } from '../../models/prodotti';
import { OrdersService } from '../../services/orders.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit{

errorMessage=""

//getter per subtotal, shippingCost, total
get subtotal(): number {
  return this.cs.subtotal;
}

get shippingCost(): number {
  return this.cs.shippingCost;
}

get total(): number {
  return this.cs.total;
}

regex = new RegExp("^(via|viale|largo|piazza|corso|strada|vicolo|piazzale|borgo|contrada|rotonda|salita|discesa|galleria|ponte|rampa|traversa)(\\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$", "i"); 
//ho utilizzato new RegExp per poter iserire la "i" per rendere le parole via, viale, largo e piazza case insensistive (+ vedi appunti) --> NB per spregazioni e approfondimenti su regex vedi appunti

//valiabili per il funzionamento dell'apertura/chiusura delle sezioni (utilizzate nella funzione saveAndContinue)

isShippingSectionOpen = true;
isPaymentSectionOpen = false;
salvaEcontinuaDesappear = false;

constructor(private cs:CartService, private router: Router, private os:OrdersService, private as:AuthService){}

pagamento = new FormGroup({

  datiSpedizione: new FormGroup ({

    nome: new FormControl ("", [

      Validators.required, 
      Validators.minLength(2), 
      Validators.pattern("^[A-Za-zÀ-ÖØ-öø-ÿ]+(\\s(([A-Za-zÀ-ÖØ-öø-ÿ]+|([A-Za-zÀ-ÖØ-öø-ÿ]\\.))*))*$")]),
     

    cognome: new FormControl ("", [

      Validators.required, 
      Validators.minLength(2),
      Validators.pattern("^[A-Za-zÀ-ÖØ-öø-ÿ]+(\\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*$")]),
     

    indirizzoCompleto: new FormGroup({

      indirizzo: new FormControl("", [
        Validators.required, 
        Validators.pattern(this.regex)]),

      civico: new FormControl("", [
        Validators.required,
        Validators.pattern("^\\d{1,4}([a-zA-Z]{1,3})?(\\s?((\\/|\\-)?\\s?\\d{1,4}[a-zA-Z]{0,3})?)?$"
      )]),
       

      cap: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern("^[0-9]+$")
        ]),

      città: new FormControl("", [
        Validators.required,
        Validators.pattern("^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$")
        ]),
      

      stato: new FormControl ("Italia")

      }),

    email: new FormControl("",[Validators.required, Validators.email]), // per validators.email vedi appunti
    
    
    telefono: new FormControl("", [

      Validators.required,
      Validators.pattern(/^(\+39\s?)?((0\d{1,4}\s?\d{6,8})|(\d{10,12}))$/) //NON FUNZIONA SE METTO ""
    ])
    
  }),

  datiPagamento: new FormGroup({

    sceltaPagamento: new FormControl("", Validators.required),

    datiCarta:new FormGroup({

      numeroCarta:new FormControl(""),
      scadenza: new FormControl(""),
      cvv: new FormControl("")
    
    })

})

})


ngOnInit():void {

  this.pagamento.get('datiPagamento')!.get('sceltaPagamento')!.valueChanges.subscribe(value => {

    const datiCarta = this.pagamento.get('datiPagamento')!.get('datiCarta') as FormGroup

    if(value === 'carta'){

      datiCarta.get('numeroCarta')?.enable()
      datiCarta.get('numeroCarta')?.addValidators([Validators.required, Validators.pattern("^(\\d{4}[-\\s]?){3}\\d{4}|\\d{15,19}$")])
      datiCarta.get('numeroCarta')?.updateValueAndValidity()

      datiCarta.get('scadenza')?.enable()
      datiCarta.get('scadenza')?.addValidators([Validators.required, Validators.pattern("^(0[1-9]|1[0-2])\\/\\d{2}$")]) 
      
      datiCarta.get('scadenza')?.updateValueAndValidity()

      datiCarta.get('cvv')?.enable()
      datiCarta.get('cvv')?.addValidators([Validators.required, Validators.pattern("^\\d{3,4}$")])
      datiCarta.get('cvv')?.updateValueAndValidity()


    } else {

      datiCarta.get('numeroCarta')?.clearValidators();
      datiCarta.get('numeroCarta')?.disable();
      datiCarta.get('numeroCarta')?.updateValueAndValidity();
    
      datiCarta.get('scadenza')?.clearValidators();
      datiCarta.get('scadenza')?.disable();
      datiCarta.get('scadenza')?.updateValueAndValidity();
    
      datiCarta.get('cvv')?.clearValidators();
      datiCarta.get('cvv')?.disable();
      datiCarta.get('cvv')?.updateValueAndValidity();

    }
  })

}


//GETTER

get sceltaPagamento() {

  return this.pagamento.get('datiPagamento')!.get('sceltaPagamento')?.value

}

//metodi che mi permettono di accedere ai campi del form
getCampoDatiSped(campo:string){ return this.pagamento.get('datiSpedizione')!.get(campo)!}

getCampoIndirizzo(campo:string){ return this.pagamento.get('datiSpedizione')!.get('indirizzoCompleto')!.get(campo)!}

getDatiCarta(campo:string){ return this.pagamento.get('datiPagamento')!.get('datiCarta')!.get(campo)!}


inviaDatiSpedPag(){

  if(this.pagamento.get('datiPagamento')!.invalid){

    this.pagamento.get('datiPagamento')!.markAllAsTouched()

  } else {

    //recupero i prodotti del carrello salvati nel localStorage
    const SavedCartProducts = localStorage.getItem("cartProducts");
    const prodotti: ProdottoCart[] = SavedCartProducts ? JSON.parse(SavedCartProducts) : [];

    //recupero l'ID dell'utente loggato (se presente)
    const loggedUserID = this.as.getLoggedUser()?.user.id

    console.log(loggedUserID)

    //assegnazione dei valori al modello Ordine 
    const order: Ordine = {

      loggedUserID: loggedUserID,

      prodotti: prodotti,

      datiSpedizione: this.pagamento.get('datiSpedizione')!.value as DatiSpedizione,
      datiPagamento: this.pagamento.get('datiPagamento')!.value as DatiPagamento
      
    }

    this.os.saveOrder(order)
      .pipe(
        catchError((err: HttpErrorResponse) => {

          this.errorMessage="Errore durante l'invio dell'ordine: " + err.message
  
          return of(undefined)
          
        })
      )
      .subscribe(response => {

        if(response){

          this.cs.clearCartOnServer()

            .pipe(

              catchError((err:HttpErrorResponse) => {

                console.log("Errore durante la pulizia del carrello sul server" + err.message);
                return of(undefined);

              })
            )
            .subscribe(() => {

              this.cs.clearCart();
              this.router.navigate(['/tank-you-page']);

              // console.log(response)

            })
          

        

        }
        
      })

    
  }
}

salvaContinua(){

  if(this.pagamento.get('datiSpedizione')?.valid){

    this.isShippingSectionOpen = false;
    this.isPaymentSectionOpen = true;
    this.salvaEcontinuaDesappear = true;

  } else {

    this.pagamento.get('datiSpedizione')?.markAllAsTouched()
  }
  

}

}

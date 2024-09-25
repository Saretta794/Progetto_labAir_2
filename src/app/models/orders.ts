import { ProdottoCart } from "./prodotti";

export interface Ordine {

    loggedUserID?:number;

    prodotti: ProdottoCart[];
    
    datiSpedizione: DatiSpedizione;
        
    datiPagamento: DatiPagamento;

    id?:string
}
      

export interface  DatiSpedizione {
    nome: string;
    cognome: string;
    indirizzoCompleto: {
        indirizzo: string;
        civico: string;
        cap: string;
        città: string;
        stato: string;
    };
    email: string;
    telefono: string;
    };

export interface DatiPagamento {

    sceltaPagamento: string;
     datiCarta: {
        numeroCarta?: string;
        scadenza?: string;
        vv?: string;
    };
    
}
    

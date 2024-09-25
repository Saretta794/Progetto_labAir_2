export interface Prodotto {
id: number,
nome: string,
categoria: string,
prezzo: number,
taglie_disponibili: number [],
colori_disponibili: string [],
descrizione: string ,
immagine: string,
nuovo_arrivo: boolean,
best_seller: number,
trend?:boolean

}

export interface ProdottoCart{

    id_prodotto:number,
    nome:string,
    categoria:string,
    prezzo_unitario:number,
    prezzo_totale:number,
    taglia:number,
    colore:string,
    immagine:string,
    nuovo_arrivo: boolean,
    best_seller: number,
    num_pezzi: number,
    id?:number 
}

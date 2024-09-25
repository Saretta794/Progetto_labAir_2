export interface registerDTO {

    nome:string,
    cognome:string,
    email:string,
    password:string

}

export interface loginDTO {

    email:string,
    password:string
    
}

export type User = {

    id:number, //me lo da il server
    nome:string,
    cognome:string,
    email:string

}

export type LoggedUser = { 

    accessToken: string, //me lo da il server (jason web token)
    user: User

}
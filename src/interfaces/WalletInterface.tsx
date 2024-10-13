export interface IWalletReponse{
    data:IWalletReponseData[],
    total: number,
    page: number,
    limit: number
}

export interface IWalletReponseData{
    id: string,
    createdAt: string,
    amount: number,
    type: string
}

export interface IWallet{
    id?:string;
    type?:string;
    page:number;
    limit:number;
}
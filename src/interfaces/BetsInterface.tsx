export interface IMyBets{
    id?:string;
    status?:string;
    page:number;
    limit:number;
}

export interface IMyBetsReponse{
    data:IMyBetsReponseData[],
    total: number,
    page: number,
    limit: number
}

export interface IMyBetsReponseData{
    id: string,
    createdAt: string,
    amount: number,
    winAmount: number,
    status: string
}

export interface INewBet{
    amount: number,
}
export interface INewBetResponse{
    transactionId: string,
    currency: string,
    balance: number,
    winAmount: number
}

export interface ICancelBetResponse{
        transactionId: string,
        balance: number,
        currency: string
}

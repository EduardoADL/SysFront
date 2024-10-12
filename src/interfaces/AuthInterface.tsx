export interface IUserRegister{
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface IUserLogin{
    email: string,
    password: string,
}

export interface IUserLoginResponse{
    id: string,
    name: string,
    balance: number,
    currency: string,
    accessToken: string
}
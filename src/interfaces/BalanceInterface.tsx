import { Dispatch, ReactNode, SetStateAction } from "react";

export interface BalanceContextType {
    balance: number;
    setBalance: Dispatch<SetStateAction<number>>;
  }
  
export interface BalanceProviderProps {
children: ReactNode;
}
  
import { createContext, useState, FC, useEffect } from "react";
import { BalanceContextType, BalanceProviderProps } from "../interfaces/BalanceInterface";

export const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: FC<BalanceProviderProps> = ({ children }) => {
const initialBalance = Number(localStorage.getItem("balance")) || 0;
  const [balance, setBalance] = useState<number>(initialBalance);

  useEffect(() => {
    localStorage.setItem("balance", balance.toString());
  }, [balance]);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

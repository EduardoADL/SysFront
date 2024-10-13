import { useContext } from "react";
import { BalanceContext } from "./BalanceContext";
import { BalanceContextType } from "../interfaces/BalanceInterface";

export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};

import axiosInstance from '../axios.config';
import axios from 'axios';
import { notifyError } from '../../utils/notify';
import { IWallet, IWalletReponse } from '../../interfaces/WalletInterface';

export const getTransactions = async (data: IWallet): Promise<IWalletReponse> => {
  try {
    const response = await axiosInstance.get('/my-transactions', {params: data});
    console.log(response);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao buscar transações');
    throw error;
  }
};

const handleError = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || defaultMessage;
      notifyError(message);
      throw new Error(message);
    } else if (error instanceof Error) {
      notifyError(error.message);
      throw new Error(error.message);
    }
    notifyError(defaultMessage);
    throw new Error(defaultMessage);
  };

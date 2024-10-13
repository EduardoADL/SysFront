import axiosInstance from '../axios.config';
import axios from 'axios';
import { notifyError } from '../../utils/notify';
import { ICancelBetResponse, IMyBets, IMyBetsReponse, INewBet, INewBetResponse } from '../../interfaces/BetsInterface';

export const getBets = async (data: IMyBets): Promise<IMyBetsReponse> => {
  try {
    const response = await axiosInstance.get('/my-bets', {params: data});
    console.log(response);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao buscar apostas');
    throw error;
  }
};

export const newBet = async (data: INewBet):Promise<INewBetResponse> => {
    try {
      const response = await axiosInstance.post('/bet', data);
      return response.data;
    } catch (error) {
      handleError(error, 'Erro ao criar aposta');
      throw error;
    }
  };

  export const deleteBet = async (id: string):Promise<ICancelBetResponse> => {
    try {
      const response = await axiosInstance.delete(`/my-bet/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, 'Erro ao criar aposta');
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

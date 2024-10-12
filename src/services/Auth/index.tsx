import { IUserLogin, IUserLoginResponse, IUserRegister } from '../../interfaces/AuthInterface';
import axiosInstance from '../axios.config';
import axios from 'axios';
import { notifyError } from '../../utils/notify';

export const createUser = async (userData: IUserRegister) => {
  try {
    const response = await axiosInstance.post('/register', userData);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao criar usuário');
  }
};

export const loginUser = async (userData: IUserLogin): Promise<IUserLoginResponse> => {
  try {
    const response = await axiosInstance.post<IUserLoginResponse>('/login', userData);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao fazer Login');
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

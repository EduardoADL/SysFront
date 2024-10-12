import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifyError = (message: string) => {
  toast(message, { type: 'error' });
};

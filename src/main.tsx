import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import './index.css'
import RoutesCfg from './Routes'
createRoot(document.getElementById('root')!).render(
  <>
    <ToastContainer style={{zIndex:10000}}/>
      <RoutesCfg/>
  </>,
)

"use strict";
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MainProvider } from './context/index.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <MainProvider>
      <App />
   </MainProvider>
)
